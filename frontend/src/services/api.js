import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleCallback: (data) => api.post('/auth/google-callback', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken })
};

export const adminService = {
  getPendingUsers: () => api.get('/auth/admin/pending'),
  getAllUsers: () => api.get('/auth/admin/users'),
  approveUser: (userId) => api.put(`/auth/admin/users/${userId}/approve`),
  rejectUser: (userId) => api.put(`/auth/admin/users/${userId}/reject`)
};

// User Services
export const userService = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadProfilePhoto: (photoUrl) =>
    api.post('/users/profile/photo', { photoUrl }),
  addConnection: (userId) => api.post(`/users/connections/add/${userId}`),
  respondToConnection: (userId, status) =>
    api.post(`/users/connections/respond/${userId}`, { status }),
  getConnections: (userId) => api.get(`/users/connections/${userId}`),
  searchUsers: (query) => api.get('/users/search', { params: { q: query } })
};

// Post Services
export const postService = {
  createPost: (data) => api.post('/posts', data),
  getNewsFeed: (page, limit) =>
    api.get('/posts/feed', { params: { page, limit } }),
  getPost: (postId) => api.get(`/posts/${postId}`),
  likePost: (postId) => api.post(`/posts/${postId}/like`),
  commentOnPost: (postId, content) =>
    api.post(`/posts/${postId}/comment`, { content }),
  deletePost: (postId) => api.delete(`/posts/${postId}`)
};

// Message Services
export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getConversationMessages: (conversationId, page, limit) =>
    api.get(`/messages/conversations/${conversationId}/messages`, {
      params: { page, limit }
    }),
  sendMessage: (conversationId, data) =>
    api.post(`/messages/conversations/${conversationId}/messages`, data),
  startConversation: (participantId) =>
    api.post('/messages/conversations/start', { participantId }),
  markAsRead: (messageId) =>
    api.post(`/messages/messages/${messageId}/read`)
};

// Job Services
export const jobService = {
  createJobPosting: (data) => api.post('/jobs', data),
  getJobPostings: (page, limit, category) =>
    api.get('/jobs', { params: { page, limit, category } }),
  getJobPosting: (jobId) => api.get(`/jobs/${jobId}`),
  applyForJob: (jobId, data) =>
    api.post(`/jobs/${jobId}/apply`, data),
  saveJobPosting: (jobId) => api.post(`/jobs/${jobId}/save`),
  getMyApplications: () => api.get('/jobs/my-applications')
};

// Group Services
export const groupService = {
  createGroup: (data) => api.post('/groups', data),
  getGroups: (page, limit, category) =>
    api.get('/groups', { params: { page, limit, category } }),
  getGroup: (groupId) => api.get(`/groups/${groupId}`),
  joinGroup: (groupId) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId) => api.post(`/groups/${groupId}/leave`),
  createGroupPost: (groupId, data) =>
    api.post(`/groups/${groupId}/posts`, data)
};

// Event Services
export const eventService = {
  createEvent: (data) => api.post('/events', data),
  getEvents: (page, limit, category, status) =>
    api.get('/events', { params: { page, limit, category, status } }),
  getEvent: (eventId) => api.get(`/events/${eventId}`),
  registerForEvent: (eventId) =>
    api.post(`/events/${eventId}/register`),
  unregisterFromEvent: (eventId) =>
    api.post(`/events/${eventId}/unregister`)
};

// Notification Services
export const notificationService = {
  getNotifications: (page, limit) =>
    api.get('/notifications', { params: { page, limit } }),
  markAsRead: (notificationId) =>
    api.post(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`)
};

export default api;
