# KMU Alumni Network Application

A comprehensive alumni networking platform for Kenya Methodist University, similar to LinkedIn, built with the MERN stack.

## Features

### 🔐 Authentication & User Management
- Email and password registration/login
- Google OAuth integration
- User profile with education, work experience, and skills
- Profile photo and cover photo
- User search functionality

### 👥 Social Networking
- Connection requests and management
- Followers and following system
- User profiles with detailed information
- Connection recommendations

### 📰 News Feed & Posts
- Create and share posts with text, images, and videos
- Like and comment on posts
- Post visibility controls (public, connections only, private)
- Real-time notifications for post interactions
- Share posts functionality

### 💼 Job Board
- Post job opportunities with detailed descriptions
- Job search and filtering by category and experience level
- Apply for jobs with resume and cover letter
- Save job postings
- Track application status
- Salary information and benefits listing

### 💬 Messaging
- Direct messaging between users
- Group conversations
- Message attachments support
- Mark messages as read
- Conversation history

### 👨‍💼 Groups & Communities
- Create and join alumni groups
- Group-based discussions and posts
- Group membership management
- Category-based group organization
- Public and private groups

### 📅 Events Management
- Create and post alumni events
- Event registration and management
- Event categorization (Career, Social, Educational, Alumni)
- Support for both virtual and in-person events
- Attendee tracking
- Event agenda and speaker management

### 🔔 Notifications
- Real-time notifications for:
  - Connection requests and acceptances
  - Post likes and comments
  - Job applications and recommendations
  - Event invitations
  - Group invitations
  - Messages
- Mark notifications as read/unread
- Notification deletion

## Database Models

### Core Entities
1. **User** - Complete user profiles with KMU alumni info
2. **Post** - News feed posts with likes and comments
3. **Comment** - Comments on posts and nested replies
4. **Message** - Direct messaging
5. **Conversation** - Message threads (1-on-1 or group)
6. **JobPosting** - Job opportunities
7. **JobApplication** - Job applications with status tracking
8. **Group** - Alumni groups and communities
9. **GroupPost** - Posts within groups
10. **Event** - Alumni events and reunions
11. **Notification** - User notifications

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **OAuth:** Google OAuth 2.0
- **Password Hashing:** bcryptjs

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Styling:** CSS3

## Project Structure

```
kemuin/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling
│   ├── config/          # Database & config
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   ├── styles/      # CSS files
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── .env             # Environment variables
│   └── package.json
└── README.md
```

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   MONGODB_URL=mongodb://localhost:27017/kmu-alumni
   PORT=5000
   JWT_ACCESS_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=http://localhost:3000
   ```

4. Start MongoDB:
   ```bash
   mongod
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-callback` - Google OAuth login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `POST /api/users/connections/add/:userId` - Send connection request
- `POST /api/users/connections/respond/:userId` - Accept/reject connection

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get news feed
- `GET /api/posts/:postId` - Get post details
- `POST /api/posts/:postId/like` - Like post
- `POST /api/posts/:postId/comment` - Comment on post

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/conversations/start` - Start new conversation
- `GET /api/messages/conversations/:conversationId/messages` - Get messages
- `POST /api/messages/conversations/:conversationId/messages` - Send message

### Jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get job listings
- `POST /api/jobs/:jobId/apply` - Apply for job
- `POST /api/jobs/:jobId/save` - Save job posting

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `POST /api/groups/:groupId/join` - Join group
- `POST /api/groups/:groupId/posts` - Create group post

### Events
- `POST /api/events` - Create event
- `GET /api/events` - Get events
- `POST /api/events/:eventId/register` - Register for event

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/:notificationId/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

## Future Enhancements

- [ ] Real-time notifications using Socket.io
- [ ] Image upload to Cloudinary
- [ ] Advanced search and filtering
- [ ] User recommendations engine
- [ ] Analytics and insights dashboard
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] User verification badges
- [ ] Advanced messaging features (voice, video)
- [ ] Event ticketing system
- [ ] Job recommendation engine
- [ ] Resume parsing and matching

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@kmuAlumni.com or create an issue in the repository.

## Acknowledgments

- Kenya Methodist University
- All contributors and testers
- MERN Stack Community
