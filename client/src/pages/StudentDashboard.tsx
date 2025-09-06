import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  status: 'pending' | 'completed';
}

interface Grade {
  subject: string;
  grade: string;
  percentage: number;
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState(92);

  useEffect(() => {
    // Mock data for student dashboard
    const mockAssignments: Assignment[] = [
      {
        _id: '1',
        title: 'Math Homework',
        description: 'Complete exercises 1-20 from chapter 5',
        dueDate: '2024-09-15',
        subject: 'Mathematics',
        status: 'pending'
      },
      {
        _id: '2',
        title: 'Science Project',
        description: 'Build a model of the solar system',
        dueDate: '2024-09-20',
        subject: 'Science',
        status: 'completed'
      }
    ];

    const mockGrades: Grade[] = [
      { subject: 'Mathematics', grade: 'A', percentage: 95 },
      { subject: 'Science', grade: 'B+', percentage: 88 },
      { subject: 'English', grade: 'A-', percentage: 92 },
      { subject: 'History', grade: 'B', percentage: 85 }
    ];

    setAssignments(mockAssignments);
    setGrades(mockGrades);
  }, []);

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <div>
      <h1 className="mb-4">Student Dashboard</h1>
      <p className="text-muted">Welcome, {user?.name}! Here's your academic overview.</p>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Attendance</h5>
              <h2>{attendance}%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Pending Assignments</h5>
              <h2>{pendingAssignments.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Completed Assignments</h5>
              <h2>{completedAssignments.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Grades Overview */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Current Grades</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {grades.map(grade => (
                  <div key={grade.subject} className="col-md-3 mb-3">
                    <div className="card text-center">
                      <div className="card-body">
                        <h6 className="card-title">{grade.subject}</h6>
                        <h4 className={`text-${grade.percentage >= 90 ? 'success' : grade.percentage >= 80 ? 'info' : grade.percentage >= 70 ? 'warning' : 'danger'}`}>
                          {grade.grade}
                        </h4>
                        <small className="text-muted">{grade.percentage}%</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="text-warning">Pending Assignments</h5>
            </div>
            <div className="card-body">
              {pendingAssignments.length > 0 ? (
                pendingAssignments.map(assignment => (
                  <div key={assignment._id} className="mb-3 p-3 border rounded">
                    <h6>{assignment.title}</h6>
                    <p className="mb-1">{assignment.description}</p>
                    <small className="text-muted">
                      {assignment.subject} | Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">No pending assignments</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="text-success">Completed Assignments</h5>
            </div>
            <div className="card-body">
              {completedAssignments.length > 0 ? (
                completedAssignments.map(assignment => (
                  <div key={assignment._id} className="mb-3 p-3 border rounded bg-light">
                    <h6>{assignment.title}</h6>
                    <p className="mb-1">{assignment.description}</p>
                    <small className="text-muted">
                      {assignment.subject} | Completed: {new Date(assignment.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted">No completed assignments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;