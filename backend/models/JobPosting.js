const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      type: String,
      required: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Freelance'],
      required: true
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
      default: 'Mid-level'
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'KES'
      }
    },
    skills: [String],
    benefits: [String],
    category: String,
    applicationDeadline: Date,
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication'
      }
    ],
    applicantCount: {
      type: Number,
      default: 0
    },
    views: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        viewedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    saves: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        savedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    status: {
      type: String,
      enum: ['open', 'closed', 'filled', 'archived'],
      default: 'open'
    },
    createdAt: {
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

jobPostingSchema.index({ postedBy: 1, createdAt: -1 });
jobPostingSchema.index({ status: 1, createdAt: -1 });
jobPostingSchema.index({ category: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);
