import React, { useState, useEffect } from 'react';

interface Student {
  _id: string;
  name: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

const Reports = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [averageGrade, setAverageGrade] = useState(0);

  useEffect(() => {
    // Fetch students data
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setTotalStudents(data.length);
      })
      .catch(err => console.error("Failed to fetch students:", err));

    // Mock data for attendance and grades (in a real app, these would come from the server)
    setAttendanceRate(85);
    setAverageGrade(78);
  }, []);

  return (
    <div>
      <h1 className="mb-4">Reports & Analytics</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              <h2 className="text-primary">{totalStudents}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Attendance Rate</h5>
              <h2 className="text-success">{attendanceRate}%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Average Grade</h5>
              <h2 className="text-info">{averageGrade}%</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Recent Student Activity
            </div>
            <ul className="list-group list-group-flush">
              {students.slice(0, 5).map(student => (
                <li key={student._id} className="list-group-item">
                  {student.name} - Added to system
                </li>
              ))}
              {students.length === 0 && (
                <li className="list-group-item">No recent activity</li>
              )}
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              Grade Distribution
            </div>
            <div className="card-body">
              <div className="mb-2">
                <span>A (90-100%): </span>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{width: '20%'}}>20%</div>
                </div>
              </div>
              <div className="mb-2">
                <span>B (80-89%): </span>
                <div className="progress">
                  <div className="progress-bar bg-info" style={{width: '35%'}}>35%</div>
                </div>
              </div>
              <div className="mb-2">
                <span>C (70-79%): </span>
                <div className="progress">
                  <div className="progress-bar bg-warning" style={{width: '30%'}}>30%</div>
                </div>
              </div>
              <div className="mb-2">
                <span>D/F (Below 70%): </span>
                <div className="progress">
                  <div className="progress-bar bg-danger" style={{width: '15%'}}>15%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
