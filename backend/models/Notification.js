const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: [
        'connection_request',
        'connection_accepted',
        'post_like',
        'post_comment',
        'comment_reply',
        'mention',
        'job_application',
        'job_recommendation',
        'event_invitation',
        'group_invitation',
        'message',
        'profile_view',
        'announcement'
      ],
      required: true
    },
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['User', 'Post', 'Comment', 'JobPosting', 'Event', 'Group', 'Message']
      },
      entityId: mongoose.Schema.Types.ObjectId
    },
    title: {
      type: String,
      required: true
    },
    message: String,
    actionUrl: String,
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 2592000 } // Auto-delete after 30 days
    }
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
