const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false // Don't return password by default
    },
    phone: {
      type: String,
      trim: true
    },

    // Profile
    profilePhoto: String,
    coverPhoto: String,
    bio: String,
    headline: String,
    location: String,
    website: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },

    //KEMU Alumni Info
    graduationYear: Number,
    school: String,
    studentId: String,
    department: String,
    course: String,
    degreeType: {
      type: String,
      enum: ['Certificate', 'Diploma', 'Bachelor', 'Master', 'PhD']
    },

    // Professional Info
    jobTitle: String,
    company: String,
    industry: String,
    skills: [String],
    workExperience: [
      {
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        description: String,
        isCurrent: Boolean
      }
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
        description: String
      }
    ],

    // Social
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    connections: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'blocked'],
          default: 'pending'
        },
        connectedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Authentication
    googleId: String,
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Account Access
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // Settings
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowNotifications: {
      type: Boolean,
      default: true
    },
    allowJobRecommendations: {
      type: Boolean,
      default: true
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    deactivatedAt: Date,

    // Metadata
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (passwordAttempt) {
  return await bcrypt.compare(passwordAttempt, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
