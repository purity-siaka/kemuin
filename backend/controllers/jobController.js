const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const Notification = require('../models/Notification');

// Create job posting
const createJobPosting = async (req, res) => {
  try {
    const { title, description, company, location, jobType, experienceLevel, skills, salary } = req.body;

    const job = new JobPosting({
      title,
      description,
      company,
      postedBy: req.userId,
      location,
      jobType,
      experienceLevel,
      skills: skills || [],
      salary
    });

    await job.save();
    await job.populate('postedBy', 'firstName lastName profilePhoto');

    res.status(201).json({ message: 'Job posting created', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create job posting', error: error.message });
  }
};

// Get all job postings
const getJobPostings = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, experienceLevel } = req.query;
    const skip = (page - 1) * limit;

    const filter = { status: 'open' };
    if (category) filter.category = category;
    if (experienceLevel) filter.experienceLevel = experienceLevel;

    const jobs = await JobPosting.find(filter)
      .populate('postedBy', 'firstName lastName profilePhoto company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobPosting.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Get job by ID
const getJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.jobId)
      .populate('postedBy', 'firstName lastName profilePhoto company')
      .populate('applications');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job', error: error.message });
  }
};

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter, portfolio } = req.body;

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({
      job: jobId,
      applicant: req.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = new JobApplication({
      job: jobId,
      applicant: req.userId,
      resume,
      coverLetter,
      portfolio
    });

    await application.save();

    job.applications.push(application._id);
    job.applicantCount = job.applications.length;
    await job.save();

    // Send notification to job poster
    const notification = new Notification({
      recipient: job.postedBy,
      sender: req.userId,
      type: 'job_application',
      title: 'New application for your job posting',
      relatedEntity: {
        entityType: 'JobPosting',
        entityId: jobId
      }
    });

    await notification.save();

    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply for job', error: error.message });
  }
};

// Get user's job applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ applicant: req.userId })
      .populate('job', 'title company location jobType')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

// Save job posting
const saveJobPosting = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await JobPosting.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const alreadySaved = job.saves.some(
      (save) => save.userId.toString() === req.userId.toString()
    );

    if (alreadySaved) {
      job.saves = job.saves.filter(
        (save) => save.userId.toString() !== req.userId.toString()
      );
    } else {
      job.saves.push({ userId: req.userId });
    }

    await job.save();
    res.json({ message: alreadySaved ? 'Job unsaved' : 'Job saved', job });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save job', error: error.message });
  }
};

module.exports = {
  createJobPosting,
  getJobPostings,
  getJobPosting,
  applyForJob,
  getMyApplications,
  saveJobPosting
};
