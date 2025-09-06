import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Grades from './pages/Grades';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Announcements from './pages/Announcements';
import Assignments from './pages/Assignments';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ExamManagement from './pages/ExamManagement';
import TakeExam from './pages/TakeExam';
import ExamResults from './pages/ExamResults';
import './App.css';

// Main App component that uses authentication
const AppContent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className="container mt-4">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          } />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'admin' ? <AdminDashboard /> :
               user?.role === 'student' ? <StudentDashboard /> :
               user?.role === 'parent' ? <ParentDashboard /> :
               <Dashboard />}
            </ProtectedRoute>
          } />

          {/* Admin only routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Student only routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* Parent only routes */}
          <Route path="/parent" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } />

          {/* Teacher/Admin routes */}
          <Route path="/students" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Students />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Attendance />
            </ProtectedRoute>
          } />
          <Route path="/grades" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Grades />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/assignments" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Assignments />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Calendar />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/exams" element={
            <ProtectedRoute allowedRoles={['admin', 'teacher']}>
              <ExamManagement />
            </ProtectedRoute>
          } />
          <Route path="/exams/:id" element={
            <ProtectedRoute allowedRoles={['student']}>
              <TakeExam />
            </ProtectedRoute>
          } />
          <Route path="/student/exam-results" element={
            <ProtectedRoute allowedRoles={['student']}>
              <ExamResults />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

// Wrapper component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;