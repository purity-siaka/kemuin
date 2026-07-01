import React, { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import '../../styles/Profile.css';

const Profile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userResponse = await userService.getProfile(userId);
      setUser(userResponse.data);

      const connectionsResponse = await userService.getConnections(userId);
      setConnections(connectionsResponse.data.connections);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.coverPhoto} alt="Cover" className="cover-photo" />
        <div className="profile-info">
          <img src={user.profilePhoto} alt={user.firstName} className="profile-photo" />
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="headline">{user.headline}</p>
          <p className="company">{user.company}</p>
          <p className="location">📍 {user.location}</p>
          <button>Add Connection</button>
        </div>
      </div>

      <div className="profile-details">
        <div className="section">
          <h3>About</h3>
          <p>{user.bio}</p>
        </div>

        <div className="section">
          <h3>Education</h3>
          <div className="education-list">
            {user.education?.map((edu, idx) => (
              <div key={idx} className="education-item">
                <h4>{edu.school}</h4>
                <p>{edu.degree} in {edu.fieldOfStudy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Experience</h3>
          <div className="experience-list">
            {user.workExperience?.map((exp, idx) => (
              <div key={idx} className="experience-item">
                <h4>{exp.position}</h4>
                <p>{exp.company}</p>
                <p className="date">
                  {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Skills</h3>
          <div className="skills-list">
            {user.skills?.map((skill, idx) => (
              <span key={idx} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Connections ({connections.length})</h3>
          <div className="connections-grid">
            {connections.map((conn) => (
              <div key={conn.userId._id} className="connection-card">
                <img src={conn.userId.profilePhoto} alt={conn.userId.firstName} />
                <h4>{conn.userId.firstName} {conn.userId.lastName}</h4>
                <p>{conn.userId.headline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
