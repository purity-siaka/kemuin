const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const eventController = require('../controllers/eventController');

// Event routes
router.post('/', auth, eventController.createEvent);
router.get('/', eventController.getEvents);
router.get('/:eventId', eventController.getEvent);
router.post('/:eventId/register', auth, eventController.registerForEvent);
router.post('/:eventId/unregister', auth, eventController.unregisterFromEvent);

module.exports = router;
