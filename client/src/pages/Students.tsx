import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Student {
  _id: string;
  name: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ name: '', parentName: '', parentEmail: '', parentPhone: '' });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Failed to fetch students:", err));
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStudent),
    })
      .then(res => res.json())
      .then(addedStudent => {
        setStudents([...students, addedStudent]);
        setNewStudent({ name: '', parentName: '', parentEmail: '', parentPhone: '' });
      })
      .catch(err => console.error("Failed to add student:", err));
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editingStudent.name.trim()) return;

    fetch(`http://localhost:5000/api/students/${editingStudent._id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingStudent),
        })
        .then(() => {
            setStudents(students.map(s => s._id === editingStudent._id ? editingStudent : s));
            setEditingStudent(null);
        })
        .catch(err => console.error("Failed to update student:", err));
  };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' })
                .then(() => {
                    setStudents(students.filter(s => s._id !== id));
                })
                .catch(err => console.error("Failed to delete student:", err));
        }
    };

  return (
    <div>
      <h1 className="mb-4">Student Management</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Student</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Student's Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Parent's Name"
                        value={newStudent.parentName}
                        onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Parent's Email"
                        value={newStudent.parentEmail}
                        onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <input
                        type="tel"
                        className="form-control"
                        placeholder="Parent's Phone"
                        value={newStudent.parentPhone}
                        onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                    />
                </div>
            </div>
            <button className="btn btn-primary" type="submit">Add Student</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          Student List
        </div>
        <ul className="list-group list-group-flush">
          {students.length > 0 ? (
            students.map(student => (
              <li key={student._id} className="list-group-item d-flex justify-content-between align-items-center">
                <Link to={`/students/${student._id}`}>{student.name}</Link>
                <div>
                    <button className="btn btn-sm btn-info me-2" onClick={() => setEditingStudent(student)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student._id)}>Delete</button>
                </div>
              </li>
            ))
          ) : (
            <li className="list-group-item">No students yet.</li>
          )}
        </ul>
      </div>

        {editingStudent && (
            <div className="modal show d-block" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Student</h5>
                            <button type="button" className="btn-close" onClick={() => setEditingStudent(null)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdate}>
                                <div className="mb-3">
                                    <label htmlFor="studentName" className="form-label">Student Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="studentName"
                                        value={editingStudent.name}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="parentName" className="form-label">Parent Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="parentName"
                                        value={editingStudent.parentName}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="parentEmail" className="form-label">Parent Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="parentEmail"
                                        value={editingStudent.parentEmail}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, parentEmail: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="parentPhone" className="form-label">Parent Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="parentPhone"
                                        value={editingStudent.parentPhone}
                                        onChange={(e) => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Students;
