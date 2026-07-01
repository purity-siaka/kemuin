# KMU Alumni Network - Quick Start Guide

## Overview
This is a complete alumni networking platform for Kenya Methodist University alumni, featuring:
- User profiles and connections
- News feed with posts and comments
- Job board with applications
- Direct messaging
- Groups and communities
- Events management
- Real-time notifications

## Prerequisites
- Node.js (v14+)
- MongoDB (v4.0+)
- npm or yarn

## Quick Start (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
# Edit backend/.env with:
# - MongoDB connection string
# - JWT secrets
# - Google OAuth credentials (optional)

# Start MongoDB (if running locally)
mongod

# Start the server
npm start
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
# REACT_APP_API_URL=http://localhost:5000/api

# Start the React app
npm start
# App runs on http://localhost:3000
```

## What's Included

### Backend Features
✅ User authentication (Email + Google OAuth)
✅ User profiles with work experience and education
✅ Connection management system
✅ News feed with posts, likes, and comments
✅ Direct messaging (1-on-1 and group chats)
✅ Job posting and application system
✅ Groups and community features
✅ Event management and registration
✅ Real-time notification system
✅ JWT-based authentication
✅ MongoDB database with Mongoose ODM

### Frontend Features
✅ Responsive React components
✅ User authentication pages
✅ Profile pages with detailed information
✅ News feed with post creation
✅ Job browser and applications
✅ Messaging interface
✅ Groups discovery and creation
✅ Events calendar and registration
✅ Notification center
✅ Navbar with navigation
✅ Context API for state management
✅ Axios for API calls

## Database Entities

### User
- Profile information
- KMU alumni details (graduation year, department, degree)
- Work experience and education history
- Skills and certifications
- Profile photos
- Connections and followers

### Post
- Content with text, images, and videos
- Author information
- Likes and comments
- Visibility settings (public, connections, private)
- Engagement metrics

### Message & Conversation
- Direct messages between users
- Group conversations
- Message attachments
- Read receipts
- Conversation management

### JobPosting
- Job title, description, and requirements
- Company information
- Salary range and benefits
- Application tracking
- Job status management

### JobApplication
- Application details
- Resume and cover letter
- Application status tracking
- Ratings and feedback

### Group
- Group details and description
- Members and roles
- Group posts and discussions
- Category-based organization

### Event
- Event details and schedule
- Location (virtual or in-person)
- Attendee registration
- Event categories

### Notification
- Notification types (connections, likes, comments, messages, etc.)
- Auto-deletion after 30 days
- Read/unread status

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/register          - Create new account
POST   /api/auth/login             - User login
POST   /api/auth/google-callback   - Google OAuth
POST   /api/auth/refresh-token     - Refresh JWT token
POST   /api/auth/logout            - User logout
```

### User Endpoints
```
GET    /api/users/profile/:userId           - Get user profile
PUT    /api/users/profile                   - Update profile
POST   /api/users/profile/photo             - Upload profile photo
POST   /api/users/connections/add/:userId   - Send connection request
POST   /api/users/connections/respond/:userId - Accept/reject connection
GET    /api/users/connections/:userId       - Get user's connections
GET    /api/users/search                    - Search users
```

### Post Endpoints
```
POST   /api/posts                  - Create post
GET    /api/posts/feed             - Get news feed
GET    /api/posts/:postId          - Get post details
POST   /api/posts/:postId/like     - Like post
POST   /api/posts/:postId/comment  - Comment on post
DELETE /api/posts/:postId          - Delete post
```

### Messaging Endpoints
```
GET    /api/messages/conversations                          - Get all conversations
POST   /api/messages/conversations/start                    - Start new conversation
GET    /api/messages/conversations/:conversationId/messages - Get messages
POST   /api/messages/conversations/:conversationId/messages - Send message
POST   /api/messages/messages/:messageId/read               - Mark message as read
```

### Job Endpoints
```
POST   /api/jobs                  - Post job opportunity
GET    /api/jobs                  - Get job listings
GET    /api/jobs/:jobId           - Get job details
POST   /api/jobs/:jobId/apply     - Apply for job
POST   /api/jobs/:jobId/save      - Save job posting
GET    /api/jobs/my-applications  - Get your applications
```

### Group Endpoints
```
POST   /api/groups                  - Create group
GET    /api/groups                  - Get all groups
GET    /api/groups/:groupId         - Get group details
POST   /api/groups/:groupId/join    - Join group
POST   /api/groups/:groupId/leave   - Leave group
POST   /api/groups/:groupId/posts   - Create group post
```

### Event Endpoints
```
POST   /api/events                         - Create event
GET    /api/events                         - Get events
GET    /api/events/:eventId                - Get event details
POST   /api/events/:eventId/register       - Register for event
POST   /api/events/:eventId/unregister     - Unregister from event
```

### Notification Endpoints
```
GET    /api/notifications                - Get notifications
POST   /api/notifications/:id/read       - Mark as read
POST   /api/notifications/read-all       - Mark all as read
DELETE /api/notifications/:id            - Delete notification
```

## Environment Variables

### Backend (.env)
```
MONGODB_URL=mongodb://localhost:27017/kmu-alumni
PORT=5000
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## File Structure

```
kemuin/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Message.js
│   │   ├── Conversation.js
│   │   ├── JobPosting.js
│   │   ├── JobApplication.js
│   │   ├── Group.js
│   │   ├── GroupPost.js
│   │   ├── Event.js
│   │   └── Notification.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   ├── messageController.js
│   │   ├── jobController.js
│   │   ├── groupController.js
│   │   ├── eventController.js
│   │   └── notificationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── eventRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Profile/
│   │   │   ├── Feed/
│   │   │   ├── Jobs/
│   │   │   ├── Messages/
│   │   │   ├── Groups/
│   │   │   └── Events/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   └── Post/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Feed.css
│   │   │   ├── Profile.css
│   │   │   ├── Jobs.css
│   │   │   ├── Messages.css
│   │   │   ├── Groups.css
│   │   │   ├── Events.css
│   │   │   └── Navbar.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   └── .gitignore
├── README.md
└── QUICK_START.md
```

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is installed

### Port Already in Use
```bash
# Kill the process using port 5000 (backend)
lsof -i :5000
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

### CORS Issues
- Check that `FRONTEND_URL` in backend `.env` matches your frontend URL
- Verify CORS middleware in `server.js`

### Token Expired
- Implement token refresh in frontend before token expiration
- Check JWT secrets match in `.env`

## Development Tips

1. **Use Postman/Insomnia** for testing APIs during development
2. **Enable React DevTools** for debugging component state
3. **MongoDB Compass** for visual database management
4. **Enable hot reload** with nodemon on backend
5. **Use React Router DevTools** for navigation debugging

## Deployment Checklist

- [ ] Change JWT secrets to strong random values
- [ ] Set NODE_ENV to 'production'
- [ ] Use production MongoDB database
- [ ] Configure Google OAuth credentials for production domain
- [ ] Set up proper email service credentials
- [ ] Configure Cloudinary for image storage
- [ ] Enable HTTPS
- [ ] Set proper CORS origin
- [ ] Use environment variables for all secrets
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Test all major features

## Next Steps

1. Complete the environment variables configuration
2. Set up MongoDB locally or use MongoDB Atlas
3. Start the backend server
4. Start the frontend development server
5. Test user registration and login
6. Explore different features
7. Customize styling and branding
8. Deploy to production

## Support & Resources

- Express.js Documentation: https://expressjs.com
- React Documentation: https://react.dev
- MongoDB Documentation: https://docs.mongodb.com
- Mongoose Documentation: https://mongoosejs.com
- JWT Introduction: https://jwt.io

## License

MIT License - See LICENSE file for details
