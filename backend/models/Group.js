const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    photo: String,
    coverPhoto: String,
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        role: {
          type: String,
          enum: ['member', 'moderator', 'admin'],
          default: 'member'
        },
        joinedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    memberCount: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['Academic', 'Industry', 'Location', 'Interest', 'Hobby', 'Other'],
      default: 'Interest'
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupPost'
      }
    ],
    rules: [String],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true
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

groupSchema.index({ admin: 1 });
groupSchema.index({ privacy: 1, isActive: 1 });

module.exports = mongoose.model('Group', groupSchema);
