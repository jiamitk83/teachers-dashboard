import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'admin' | 'teacher' | 'student' | 'parent'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: ''
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: ''
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0
  });

  useEffect(() => {
    // Mock data for admin dashboard
    const mockUsers: User[] = [
      { _id: '1', name: 'John Admin', email: 'admin@school.com', role: 'admin' },
      { _id: '2', name: 'Jane Teacher', email: 'teacher@school.com', role: 'teacher' },
      { _id: '3', name: 'Bob Student', email: 'student@school.com', role: 'student' },
      { _id: '4', name: 'Alice Parent', email: 'parent@school.com', role: 'parent' }
    ];
    setUsers(mockUsers);

    setStats({
      totalUsers: mockUsers.length,
      totalStudents: mockUsers.filter(u => u.role === 'student').length,
      totalTeachers: mockUsers.filter(u => u.role === 'teacher').length,
      totalAdmins: mockUsers.filter(u => u.role === 'admin').length
    });
  }, []);

  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u._id !== userId));
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleCreateAnnouncement = () => {
    setShowAnnouncementModal(true);
  };

  const handleScheduleEvent = () => {
    setShowScheduleModal(true);
  };

  const handleViewReports = () => {
    setShowReportsModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleSaveEditedUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u._id === editingUser._id ? editingUser : u));
      setEditingUser(null);
      alert('User updated successfully!');
    }
  };

  const handleSaveUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        _id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
      setUsers([...users, user]);
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1,
        totalStudents: newUser.role === 'student' ? prev.totalStudents + 1 : prev.totalStudents,
        totalTeachers: newUser.role === 'teacher' ? prev.totalTeachers + 1 : prev.totalTeachers,
        totalAdmins: newUser.role === 'admin' ? prev.totalAdmins + 1 : prev.totalAdmins
      }));
      setNewUser({ name: '', email: '', role: 'student' });
      setShowAddUserModal(false);
    }
  };

  const handleSaveAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      // Here you would typically send to the server
      console.log('Creating announcement:', newAnnouncement);
      alert(`Announcement "${newAnnouncement.title}" created successfully!`);
      setNewAnnouncement({ title: '', content: '' });
      setShowAnnouncementModal(false);
    }
  };

  const handleSaveEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      // Here you would typically send to the server
      console.log('Scheduling event:', newEvent);
      alert(`Event "${newEvent.title}" scheduled successfully!`);
      setNewEvent({ title: '', date: '', time: '', description: '' });
      setShowScheduleModal(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      <p className="text-muted">Welcome, {user?.name}! You have full administrative access.</p>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2>{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Students</h5>
              <h2>{stats.totalStudents}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Teachers</h5>
              <h2>{stats.totalTeachers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Admins</h5>
              <h2>{stats.totalAdmins}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <button className="btn btn-primary w-100 mb-2" onClick={handleAddUser}>
                    <i className="bi bi-person-plus"></i> Add User
                  </button>
                </div>
                <div className="col-md-3">
                  <Link to="/exams" className="btn btn-secondary w-100 mb-2">
                    <i className="bi bi-journal-text"></i> Manage Exams
                  </Link>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-success w-100 mb-2" onClick={handleCreateAnnouncement}>
                    <i className="bi bi-file-earmark-plus"></i> Create Announcement
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-info w-100 mb-2" onClick={handleScheduleEvent}>
                    <i className="bi bi-calendar-plus"></i> Schedule Event
                  </button>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-3">
                  <button className="btn btn-warning w-100 mb-2" onClick={handleViewReports}>
                    <i className="bi bi-graph-up"></i> View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card">
        <div className="card-header">
          <h5>User Management</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'info' : user.role === 'student' ? 'success' : 'secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditUser(user)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteUser(user._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New User</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="userRole" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="userRole"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'teacher' | 'student' | 'parent' })}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveUser}>
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Announcement</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnnouncementModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="announcementTitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="announcementTitle"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="announcementContent" className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    id="announcementContent"
                    rows={4}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    placeholder="Enter announcement content"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAnnouncementModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleSaveAnnouncement}>
                  Create Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {showScheduleModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule Event</h5>
                <button type="button" className="btn-close" onClick={() => setShowScheduleModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="eventTitle" className="form-label">Event Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="eventDate" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="eventDate"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="eventTime" className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      id="eventTime"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="eventDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="eventDescription"
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter event description"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-info" onClick={handleSaveEvent}>
                  Schedule Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {showReportsModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">System Reports</h5>
                <button type="button" className="btn-close" onClick={() => setShowReportsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">User Statistics</h6>
                        <p className="card-text">
                          Total Users: {stats.totalUsers}<br/>
                          Students: {stats.totalStudents}<br/>
                          Teachers: {stats.totalTeachers}<br/>
                          Admins: {stats.totalAdmins}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">System Health</h6>
                        <p className="card-text">
                          Server Status: <span className="text-success">Online</span><br/>
                          Database: <span className="text-success">Connected</span><br/>
                          Last Backup: <span className="text-warning">Pending</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Recent Activity</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">User registration system active</li>
                      <li className="list-group-item">Database connection established</li>
                      <li className="list-group-item">Admin dashboard loaded</li>
                      <li className="list-group-item">Authentication system operational</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReportsModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-warning">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setEditingUser(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editUserName" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editUserName"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editUserEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="editUserEmail"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editUserRole" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="editUserRole"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'admin' | 'teacher' | 'student' | 'parent' })}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEditedUser}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;