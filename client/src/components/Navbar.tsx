import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/students">Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/grades">Grades</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/announcements">Announcements</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assignments">Assignments</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">Reports</Link>
            </li>
          </>
        );

      case 'teacher':
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/students">Students</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendance">Attendance</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/grades">Grades</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/announcements">Announcements</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assignments">Assignments</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">Reports</Link>
            </li>
          </>
        );

      case 'student':
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/student">My Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/assignments">My Assignments</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>
          </>
        );

      case 'parent':
        return (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/parent">Parent Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/announcements">Announcements</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calendar">Calendar</Link>
            </li>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Teacher's Dashboard</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {renderNavLinks()}
          </ul>
          {isAuthenticated && (
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user?.name} ({user?.role})
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
