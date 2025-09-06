import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'admin' | 'teacher' | 'student' | 'parent',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.role === 'parent' && !formData.studentId.trim()) {
      setError('Please enter the student ID for parent registration');
      return;
    }

    setIsLoading(true);

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'parent' && { studentId: formData.studentId })
    };

    const success = await register(registerData);

    if (success) {
      navigate('/');
    } else {
      setError('Registration failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center">Register</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {formData.role === 'parent' && (
                  <div className="mb-3">
                    <label htmlFor="studentId" className="form-label">Student ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Enter your child's student ID"
                      required
                    />
                    <div className="form-text">
                      Enter the student ID of your child to link your account.
                    </div>
                  </div>
                )}

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p>Already have an account? <a href="/login">Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;