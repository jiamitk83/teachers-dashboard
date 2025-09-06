import React, { useState, useEffect } from 'react';

// Matching the backend Student interface
interface Student {
  _id: string; // Changed from id
  name: string;
}

// Interface for an individual attendance record
interface AttendanceRecord {
  studentId: string; // Changed from number
  status: 'present' | 'absent' | 'late';
}

const Attendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord['status']>>({}); // Key is now string
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

  // Fetch students and today's attendance
  useEffect(() => {
    // Fetch all students
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(setStudents)
      .catch(err => console.error("Failed to fetch students:", err));

    // Fetch attendance for the current date
    fetch(`http://localhost:5000/api/attendance/${currentDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.records && data.records.length > 0) {
          // The accumulator is now Record<string, ...>
          const newAttendance = data.records.reduce((acc: Record<string, AttendanceRecord['status']>, record: AttendanceRecord) => {
            acc[record.studentId] = record.status;
            return acc;
          }, {});
          setAttendance(newAttendance);
        } else {
          setAttendance({}); // Clear attendance if no records for the new date
        }
      })
      .catch(err => console.error("Failed to fetch attendance:", err));
  }, [currentDate]);

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => { // studentId is now string
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSave = () => {
    const records: AttendanceRecord[] = Object.entries(attendance).map(([studentId, status]) => ({
      studentId, // No longer need Number()
      status,
    }));

    fetch('http://localhost:5000/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: currentDate, records }),
    })
      .then(res => res.json())
      .then(() => {
        alert('Attendance saved successfully!');
      })
      .catch(err => {
        console.error("Failed to save attendance:", err)
        alert('Failed to save attendance.');
      });
  };

  return (
    <div>
      <h1 className="mb-4">Attendance Tracker</h1>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <label htmlFor="attendance-date" className="form-label">Select Date:</label>
          <input
            type="date"
            id="attendance-date"
            className="form-control"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>Save Attendance</button>
      </div>

      <div className="card">
        <div className="card-header">
          {new Date(currentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <ul className="list-group list-group-flush">
          {students.length > 0 ? students.map(student => (
            <li key={student._id} className="list-group-item d-flex justify-content-between align-items-center"> {/* key is now _id */}
              <span>{student.name}</span>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${attendance[student._id] === 'present' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => handleStatusChange(student._id, 'present')}
                >
                  Present
                </button>
                <button
                  type="button"
                  className={`btn ${attendance[student._id] === 'absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => handleStatusChange(student._id, 'absent')}
                >
                  Absent
                </button>
                 <button
                  type="button"
                  className={`btn ${attendance[student._id] === 'late' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => handleStatusChange(student._id, 'late')}
                >
                  Late
                </button>
              </div>
            </li>
          )) : <li className="list-group-item">Please add students in the Student Management page first.</li>}
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
