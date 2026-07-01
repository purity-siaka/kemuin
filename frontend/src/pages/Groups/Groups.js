import React, { useState, useEffect } from 'react';
import { groupService } from '../../services/api';
import '../../styles/Groups.css';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Interest'
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupService.getGroups(1, 10);
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await groupService.createGroup(formData);
      setGroups([response.data.group, ...groups]);
      setFormData({ name: '', description: '', category: 'Interest' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await groupService.joinGroup(groupId);
      fetchGroups();
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>Groups & Communities</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="create-btn">
          Create Group
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateGroup} className="create-group-form">
          <input
            type="text"
            placeholder="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Group Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>Academic</option>
            <option>Industry</option>
            <option>Location</option>
            <option>Interest</option>
            <option>Hobby</option>
            <option>Other</option>
          </select>
          <button type="submit">Create</button>
        </form>
      )}

      <div className="groups-grid">
        {groups.map((group) => (
          <div key={group._id} className="group-card">
            <img src={group.photo} alt={group.name} className="group-photo" />
            <div className="group-info">
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <p className="members">👥 {group.memberCount} members</p>
              <p className="category">📂 {group.category}</p>
              <button onClick={() => handleJoinGroup(group._id)}>Join Group</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
