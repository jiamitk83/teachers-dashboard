import React, { useState, useEffect } from 'react';

// Interfaces
interface Student {
  _id: string; // Changed
  name: string;
}

interface Assignment {
  _id: string; // Changed
  title: string;
}

interface Grade {
  studentId: string; // Changed
  assignmentId: string; // Changed
  score: number | string;
}

const Grades = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/students').then(res => res.json()),
      fetch('http://localhost:5000/api/assignments').then(res => res.json()),
      fetch('http://localhost:5000/api/grades').then(res => res.json()),
    ])
    .then(([studentsData, assignmentsData, gradesData]) => {
      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
    })
    .catch(err => console.error("Failed to fetch gradebook data:", err));
  }, []);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle.trim()) return;

    fetch('http://localhost:5000/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newAssignmentTitle }),
    })
    .then(res => res.json())
    .then(newAssignment => {
      setAssignments([...assignments, newAssignment]);
      setNewAssignmentTitle('');
    })
    .catch(err => console.error("Failed to add assignment:", err));
  };

  const handleGradeChange = (studentId: string, assignmentId: string, score: string) => { // Changed
    const newGrades = [...grades];
    const gradeIndex = newGrades.findIndex(g => g.studentId === studentId && g.assignmentId === assignmentId);
    const newScore = score === '' ? '' : Number(score);

    if (gradeIndex !== -1) {
      newGrades[gradeIndex].score = newScore;
    } else {
      newGrades.push({ studentId, assignmentId, score: newScore });
    }
    setGrades(newGrades);
  };

  const handleGradeSave = (studentId: string, assignmentId: string) => { // Changed
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    const score = grade ? grade.score : null;

    if (score === null || score === '') return;

    fetch('http://localhost:5000/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, assignmentId, score: Number(score) }),
    }).catch(err => console.error("Failed to save grade:", err));
  };

  const getGrade = (studentId: string, assignmentId: string) => { // Changed
    const grade = grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
    return grade ? grade.score : '';
  };

  return (
    <div>
      <h1 className="mb-4">Gradebook</h1>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Assignment</h5>
          <form onSubmit={handleAddAssignment}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Assignment Title (e.g., Homework 1)"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">Add Assignment</button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Student Name</th>
              {assignments.map(ass => <th key={ass._id} className="text-center">{ass.title}</th>)} {/* Changed */}
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}> {/* Changed */}
                <td>{student.name}</td>
                {assignments.map(ass => (
                  <td key={ass._id}> {/* Changed */}
                    <input
                      type="number"
                      className="form-control"
                      value={getGrade(student._id, ass._id)} // Changed
                      onChange={(e) => handleGradeChange(student._id, ass._id, e.target.value)} // Changed
                      onBlur={() => handleGradeSave(student._id, ass._id)} // Changed
                      min="0"
                      max="100"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grades;
