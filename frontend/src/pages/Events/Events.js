import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/api';
import '../../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, [category, status]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents(1, 10, category, status);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      alert('Successfully registered for the event!');
      fetchEvents();
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Alumni Events</h1>
        <div className="filters">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Career">Career</option>
            <option value="Social">Social</option>
            <option value="Educational">Educational</option>
            <option value="Alumni">Alumni</option>
          </select>
        </div>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <img src={event.bannerPhoto} alt={event.title} className="event-banner" />
            <div className="event-details">
              <h3>{event.title}</h3>
              <p className="event-type">🎯 {event.eventType}</p>
              <p className="date">📅 {new Date(event.startDate).toLocaleDateString()}</p>
              <p className="location">📍 {event.location?.city || 'Online'}</p>
              <p className="attendees">👥 {event.attendees?.length || 0} registered</p>
              <button onClick={() => handleRegister(event._id)} className="register-btn">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
