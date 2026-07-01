const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    resume: String, // URL to resume
    coverLetter: String,
    portfolio: String,
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'shortlisted', 'rejected', 'withdrawn'],
      default: 'submitted'
    },
    ratings: Number, // Rating given by employer (1-5)
    feedback: String,
    interviewScheduled: Date,
    interviewLink: String,
    rejectionReason: String,
    appliedAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

jobApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
jobApplicationSchema.index({ applicant: 1, createdAt: -1 });
jobApplicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
