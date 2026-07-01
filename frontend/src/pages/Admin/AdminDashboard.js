import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/api';
import '../../styles/Auth.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (userId, action) => {
    try {
      if (action === 'approve') {
        await adminService.approveUser(userId);
      } else {
        await adminService.rejectUser(userId);
      }
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="auth-container"><div className="auth-box"><h2>Access denied</h2><p>You need admin access.</p></div></div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-box" style={{ maxWidth: 760 }}>
        <h2>Admin Dashboard</h2>
        <p>Review new alumni registrations and approve or reject them.</p>
        {error && <div className="error-message">{error}</div>}
        {loading ? <p>Loading...</p> : (
          <div className="form-group">
            {users.length === 0 ? <p>No pending registrations.</p> : users.map((entry) => (
              <div key={entry.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <strong>{entry.firstName} {entry.lastName}</strong>
                <div>{entry.email}</div>
                <div>Department: {entry.department || '—'} </div>
                <div>Status: {entry.status}</div>
                <div style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => handleAction(entry.id, 'approve')} style={{ marginRight: 8 }}>Approve</button>
                  <button type="button" onClick={() => handleAction(entry.id, 'reject')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
