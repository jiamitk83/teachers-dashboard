import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, late: 0 });
  const [ungradedCount, setUngradedCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    // Fetch student count
    fetch(`${API_BASE_URL}/api/students/count`)
      .then(res => res.json())
      .then(data => setStudentCount(data.count))
      .catch(err => console.error("Failed to fetch student count:", err));

    // Fetch attendance summary
    fetch(`${API_BASE_URL}/api/attendance/summary/${today}`)
      .then(res => res.json())
      .then(data => setAttendanceSummary(data))
      .catch(err => console.error("Failed to fetch attendance summary:", err));

    // Fetch ungraded assignments count
    fetch(`${API_BASE_URL}/api/assignments/ungraded-count`)
        .then(res => res.json())
        .then(data => setUngradedCount(data.count))
        .catch(err => console.error("Failed to fetch ungraded assignments count:", err));
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        {/* Summary Widgets */}
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              <p className="card-text fs-4">{studentCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Today's Attendance</h5>
              <p className="card-text fs-4">Present: {attendanceSummary.present}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Ungraded Assignments</h5>
              <p className="card-text fs-4">{ungradedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Quick Actions</h5>
                    <Link to="/students" className="btn btn-secondary me-2">Manage Students</Link>
                    <Link to="/attendance" className="btn btn-secondary me-2">Take Attendance</Link>
                    <Link to="/grades" className="btn btn-secondary">Enter Grades</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
