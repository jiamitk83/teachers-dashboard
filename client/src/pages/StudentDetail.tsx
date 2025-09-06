import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Student {
    _id: string;
    name: string;
    parentName?: string;
    parentEmail?: string;
    parentPhone?: string;
}

interface Grade {
    studentId: string;
    assignmentId: string;
    score: number | string;
}

interface Assignment {
    _id: string;
    title: string;
}

interface Attendance {
    date: string;
    records: { studentId: string; status: string }[];
}

const StudentDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [student, setStudent] = useState<Student | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [attendance, setAttendance] = useState<Attendance[]>([]);

    useEffect(() => {
        // Fetch student details
        fetch(`http://localhost:5000/api/students/${id}`)
            .then(res => res.json())
            .then(data => setStudent(data))
            .catch(err => console.error("Failed to fetch student:", err));

        // Fetch grades for the student
        fetch('http://localhost:5000/api/grades')
            .then(res => res.json())
            .then(data => setGrades(data.filter((g: Grade) => g.studentId === id)))
            .catch(err => console.error("Failed to fetch grades:", err));

        // Fetch all assignments
        fetch('http://localhost:5000/api/assignments')
            .then(res => res.json())
            .then(data => setAssignments(data))
            .catch(err => console.error("Failed to fetch assignments:", err));

        // Fetch all attendance records and filter for the student
        fetch('http://localhost:5000/api/attendance')
            .then(res => res.json())
            .then(data => {
                const studentAttendance = data.map((att: Attendance) => ({
                    ...att,
                    records: att.records.filter(r => r.studentId === id)
                })).filter((att: Attendance) => att.records.length > 0);
                setAttendance(studentAttendance);
            })
            .catch(err => console.error("Failed to fetch attendance:", err));
    }, [id]);

    const getAssignmentTitle = (assignmentId: string) => {
        const assignment = assignments.find(a => a._id === assignmentId);
        return assignment ? assignment.title : 'Unknown Assignment';
    };

    if (!student) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="mb-4">{student.name}</h1>
            <div className="row">
                <div className="col-md-12">
                    <div className="card mb-4">
                        <div className="card-header">Contact Information</div>
                        <div className="card-body">
                            <p><strong>Parent/Guardian:</strong> {student.parentName || 'N/A'}</p>
                            <p><strong>Email:</strong> {student.parentEmail || 'N/A'}</p>
                            <p><strong>Phone:</strong> {student.parentPhone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Grades</div>
                        <ul className="list-group list-group-flush">
                            {grades.map(grade => (
                                <li key={grade.assignmentId} className="list-group-item d-flex justify-content-between align-items-center">
                                    {getAssignmentTitle(grade.assignmentId)}
                                    <span className="badge bg-primary rounded-pill">{grade.score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Attendance History</div>
                        <ul className="list-group list-group-flush">
                            {attendance.map(att => (
                                <li key={att.date} className="list-group-item d-flex justify-content-between align-items-center">
                                    {new Date(att.date).toLocaleDateString()}
                                    <span className={`badge bg-${att.records[0].status === 'present' ? 'success' : att.records[0].status === 'absent' ? 'danger' : 'warning'}`}>
                                        {att.records[0].status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;
