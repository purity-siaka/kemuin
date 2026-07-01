const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    images: [
      {
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    videos: [
      {
        url: String,
        thumbnail: String,
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    tags: [String],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        likedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    shares: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        sharedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
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
    isPublished: {
      type: Boolean,
      default: true
    },
    visibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public'
    },
    pinnedAt: Date,
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

// Index for faster queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ isPublished: 1, visibility: 1 });

module.exports = mongoose.model('Post', postSchema);
