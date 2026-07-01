import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1>🎓KEMU Alumni</h1>
        </div>
        <div className="nav-links">
          <Link to="/feed">Feed</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/groups">Groups</Link>
          <Link to="/events">Events</Link>
          <Link to="/messages">Messages</Link>
        </div>
        <div className="nav-user">
          {user?.role === 'admin' && <Link to="/admin" className="nav-admin-link">Admin</Link>}
          <span>{user?.firstName} {user?.lastName}</span>
          <img src={user?.profilePhoto} alt={user?.firstName} className="profile-pic" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
