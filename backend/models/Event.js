const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
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
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    photo: String,
    bannerPhoto: String,
    eventType: {
      type: String,
      enum: ['Networking', 'Workshop', 'Seminar', 'Conference', 'Meetup', 'Reunion', 'Webinar', 'Other'],
      required: true
    },
    category: {
      type: String,
      enum: ['Career', 'Social', 'Educational', 'Alumni', 'Sports', 'Charity', 'Other'],
      default: 'Alumni'
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    location: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    isVirtual: {
      type: Boolean,
      default: false
    },
    eventLink: String,
    meetingLink: String,
    maxAttendees: Number,
    registrationDeadline: Date,
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['registered', 'attended', 'cancelled', 'waitlisted'],
          default: 'registered'
        },
        registeredAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    speakers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        topic: String,
        bio: String
      }
    ],
    agenda: [
      {
        time: String,
        activity: String,
        speaker: String
      }
    ],
    image: String,
    tags: [String],
    isPublished: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
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

eventSchema.index({ organizer: 1, startDate: -1 });
eventSchema.index({ status: 1, startDate: 1 });
eventSchema.index({ isFeatured: 1, startDate: -1 });

module.exports = mongoose.model('Event', eventSchema);
