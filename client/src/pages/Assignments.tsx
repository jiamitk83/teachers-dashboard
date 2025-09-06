import React, { useState, useEffect, FormEvent } from 'react';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  status: 'pending' | 'completed';
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: ''
  });

  useEffect(() => {
    // Mock data for assignments (in a real app, this would come from the server)
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
    setAssignments(mockAssignments);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.dueDate) return;

    const assignment: Assignment = {
      _id: Date.now().toString(),
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate,
      subject: newAssignment.subject,
      status: 'pending'
    };

    setAssignments([...assignments, assignment]);
    setNewAssignment({ title: '', description: '', dueDate: '', subject: '' });
  };

  const toggleStatus = (id: string) => {
    setAssignments(assignments.map(assignment =>
      assignment._id === id
        ? { ...assignment, status: assignment.status === 'pending' ? 'completed' : 'pending' }
        : assignment
    ));
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  return (
    <div>
      <h1 className="mb-4">Assignments</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Create New Assignment</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Assignment Title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Subject"
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={3}
                placeholder="Assignment Description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <input
                type="date"
                className="form-control"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit">Create Assignment</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          Assignment List
        </div>
        <ul className="list-group list-group-flush">
          {assignments.length > 0 ? (
            assignments.map((assignment: Assignment) => (
              <li key={assignment._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{assignment.title}</h5>
                    <p className="mb-1">{assignment.description}</p>
                    <small className="text-muted">
                      Subject: {assignment.subject} | Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className={`badge bg-${getStatusColor(assignment.status)} me-2`}>
                      {assignment.status}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleStatus(assignment._id)}
                    >
                      {assignment.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item">No assignments yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Assignments;