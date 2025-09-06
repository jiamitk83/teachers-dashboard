import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [grades, setGrades] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:5000/api/assignments').then(res => res.json()),
            fetch('http://localhost:5000/api/grades').then(res => res.json()),
            fetch('http://localhost:5000/api/students').then(res => res.json()),
        ])
            .then(([assignmentsData, gradesData, studentsData]) => {
                setAssignments(assignmentsData);
                setGrades(gradesData);
                setStudents(studentsData);
            })
            .catch(err => console.error("Failed to fetch data:", err));
    }, []);

    const getAssignmentAverages = () => {
        return assignments.map(assignment => {
            const assignmentGrades = grades.filter(g => g.assignmentId === assignment._id);
            const totalScore = assignmentGrades.reduce((acc, grade) => acc + grade.score, 0);
            const average = assignmentGrades.length > 0 ? totalScore / assignmentGrades.length : 0;
            return { name: assignment.title, average };
        });
    };

    const getGradeDistribution = () => {
        const distribution = {
            'A (90-100)': 0,
            'B (80-89)': 0,
            'C (70-79)': 0,
            'D (60-69)': 0,
            'F (<60)': 0,
        };

        grades.forEach(grade => {
            if (grade.score >= 90) distribution['A (90-100)']++;
            else if (grade.score >= 80) distribution['B (80-89)']++;
            else if (grade.score >= 70) distribution['C (70-79)']++;
            else if (grade.score >= 60) distribution['D (60-69)']++;
            else distribution['F (<60)']++;
        });

        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    };

    return (
        <div>
            <h1 className="mb-4">Class Performance Analytics</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Assignment Averages</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getAssignmentAverages()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="average" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Overall Grade Distribution</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getGradeDistribution()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
