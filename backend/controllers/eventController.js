const Event = require('../models/Event');
const Notification = require('../models/Notification');

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, eventType, category, maxAttendees, meetingLink } = req.body;

    const event = new Event({
      title,
      description,
      organizer: req.userId,
      startDate,
      endDate,
      location,
      eventType,
      category,
      maxAttendees,
      meetingLink,
      attendees: [{ userId: req.userId, status: 'attended' }]
    });

    await event.save();
    await event.populate('organizer', 'firstName lastName profilePhoto');

    res.status(201).json({ message: 'Event created', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (status) filter.status = status;

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName profilePhoto')
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// Get event by ID
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('organizer', 'firstName lastName profilePhoto email')
      .populate('attendees.userId', 'firstName lastName profilePhoto')
      .populate('speakers.userId', 'firstName lastName profilePhoto');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const isRegistered = event.attendees.some(
      (attendee) => attendee.userId.toString() === req.userId.toString()
    );

    if (isRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check max attendees
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      event.attendees.push({
        userId: req.userId,
        status: 'waitlisted'
      });
    } else {
      event.attendees.push({
        userId: req.userId,
        status: 'registered'
      });
    }

    await event.save();

    // Send notification to organizer
    const notification = new Notification({
      recipient: event.organizer,
      sender: req.userId,
      type: 'event_invitation',
      title: 'Someone registered for your event',
      relatedEntity: {
        entityType: 'Event',
        entityId: eventId
      }
    });

    await notification.save();

    res.json({ message: 'Registered for event', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register for event', error: error.message });
  }
};

// Unregister from event
const unregisterFromEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.userId.toString() !== req.userId.toString()
    );

    await event.save();
    res.json({ message: 'Unregistered from event', event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unregister', error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  registerForEvent,
  unregisterFromEvent
};
