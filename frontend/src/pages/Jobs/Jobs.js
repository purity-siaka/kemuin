import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/api';
import '../../styles/Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [category, page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobPostings(page, 10, category);
      if (page === 1) {
        setJobs(response.data.jobs);
      } else {
        setJobs([...jobs, ...response.data.jobs]);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobService.applyForJob(jobId, { resume: 'resume-url' });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

  const handleSave = async (jobId) => {
    try {
      await jobService.saveJobPosting(jobId);
      alert('Job saved!');
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Job Opportunities</h1>
        <div className="filter">
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
      </div>

      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <h3>{job.title}</h3>
              <span className="job-type">{job.jobType}</span>
            </div>
            <p className="company">{job.company}</p>
            <p className="location">📍 {job.location}</p>
            <p className="description">{job.description.substring(0, 200)}...</p>
            <div className="job-meta">
              <span className="experience">{job.experienceLevel}</span>
              <span className="salary">KES {job.salary?.min} - {job.salary?.max}</span>
            </div>
            <div className="job-skills">
              {job.skills?.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="skill">{skill}</span>
              ))}
            </div>
            <div className="job-actions">
              <button onClick={() => handleApply(job._id)} className="apply-btn">
                Apply Now
              </button>
              <button onClick={() => handleSave(job._id)} className="save-btn">
                💾 Save
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && (
        <button onClick={() => setPage(page + 1)} className="load-more">
          Load More Jobs
        </button>
      )}
    </div>
  );
};

export default Jobs;
