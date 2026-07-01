const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const jobController = require('../controllers/jobController');

// Job routes
router.post('/', auth, jobController.createJobPosting);
router.get('/', jobController.getJobPostings);
router.get('/:jobId', jobController.getJobPosting);
router.post('/:jobId/apply', auth, jobController.applyForJob);
router.post('/:jobId/save', auth, jobController.saveJobPosting);
router.get('/my-applications', auth, jobController.getMyApplications);

module.exports = router;
