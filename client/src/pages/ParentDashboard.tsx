import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface StudentInfo {
  _id: string;
  name: string;
  grade: string;
  attendance: number;
  assignments: {
    pending: number;
    completed: number;
  };
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const ParentDashboard = () => {
  const { user } = useAuth();
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    // Mock data for parent dashboard
    const mockStudentInfo: StudentInfo = {
      _id: '123',
      name: 'Alex Johnson',
      grade: '9th Grade',
      attendance: 95,
      assignments: {
        pending: 3,
        completed: 12
      }
    };

    const mockAnnouncements: Announcement[] = [
      {
        _id: '1',
        title: 'Parent-Teacher Conference',
        content: 'Parent-teacher conferences will be held next week. Please schedule your appointment.',
        date: new Date().toISOString(),
        priority: 'high'
      },
      {
        _id: '2',
        title: 'School Holiday Notice',
        content: 'School will be closed on Monday due to maintenance work.',
        date: new Date().toISOString(),
        priority: 'medium'
      }
    ];

    setStudentInfo(mockStudentInfo);
    setAnnouncements(mockAnnouncements);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h1 className="mb-4">Parent Dashboard</h1>
      <p className="text-muted">Welcome, {user?.name}! Monitor your child's academic progress.</p>

      {/* Child Information */}
      {studentInfo && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <h5>Student Information: {studentInfo.name}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Grade</h6>
                      <h4 className="text-primary">{studentInfo.grade}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Attendance</h6>
                      <h4 className="text-success">{studentInfo.attendance}%</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Pending Assignments</h6>
                      <h4 className="text-warning">{studentInfo.assignments.pending}</h4>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <h6>Completed Assignments</h6>
                      <h4 className="text-info">{studentInfo.assignments.completed}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <button className="btn btn-primary w-100 mb-2">
                    <i className="bi bi-envelope"></i> Contact Teacher
                  </button>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-success w-100 mb-2">
                    <i className="bi bi-calendar-check"></i> Schedule Meeting
                  </button>
                </div>
                <div className="col-md-4">
                  <button className="btn btn-info w-100 mb-2">
                    <i className="bi bi-graph-up"></i> View Detailed Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>School Announcements</h5>
            </div>
            <div className="card-body">
              {announcements.length > 0 ? (
                announcements.map(announcement => (
                  <div key={announcement._id} className="mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">{announcement.title}</h6>
                      <span className={`badge bg-${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="mb-2">{announcement.content}</p>
                    <small className="text-muted">
                      {new Date(announcement.date).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">No announcements at this time</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Academic Progress Overview */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Subject Performance</h5>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <span>Mathematics: </span>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{width: '95%'}}>A (95%)</div>
                </div>
              </div>
              <div className="mb-2">
                <span>Science: </span>
                <div className="progress">
                  <div className="progress-bar bg-info" style={{width: '88%'}}>B+ (88%)</div>
                </div>
              </div>
              <div className="mb-2">
                <span>English: </span>
                <div className="progress">
                  <div className="progress-bar bg-warning" style={{width: '82%'}}>B (82%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <h6>Assignment Completed</h6>
                    <p>Math homework submitted on time</p>
                    <small className="text-muted">2 days ago</small>
                  </div>
                </div>
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <h6>Good Attendance</h6>
                    <p>Perfect attendance this week</p>
                    <small className="text-muted">5 days ago</small>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <h6>Assignment Due</h6>
                    <p>Science project due tomorrow</p>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;