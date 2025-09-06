import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

interface Exam {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  totalMarks: number;
  assignedTo: string[];
  createdAt: string;
}

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [] as Question[],
    assignedTo: [] as string[]
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    marks: 1
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/exams');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleCreateExam = async () => {
    if (!newExam.title || newExam.questions.length === 0) {
      alert('Please provide exam title and at least one question');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newExam,
          totalMarks: newExam.questions.reduce((sum, q) => sum + q.marks, 0)
        }),
      });

      if (response.ok) {
        alert('Exam created successfully!');
        setShowCreateModal(false);
        setNewExam({
          title: '',
          description: '',
          duration: 60,
          questions: [],
          assignedTo: []
        });
        fetchExams();
      }
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      alert('Please fill all question fields');
      return;
    }

    setNewExam({
      ...newExam,
      questions: [...newExam.questions, currentQuestion]
    });

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      marks: 1
    });
  };

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/exams/${examId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Exam deleted successfully!');
          fetchExams();
        }
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Exam Management</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="bi bi-plus-circle"></i> Create New Exam
        </button>
      </div>

      <div className="row">
        {exams.map(exam => (
          <div key={exam._id} className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{exam.title}</h5>
                <p className="card-text">{exam.description}</p>
                <div className="mb-2">
                  <small className="text-muted">
                    Duration: {exam.duration} minutes | Total Marks: {exam.totalMarks}
                  </small>
                </div>
                <div className="mb-2">
                  <small className="text-muted">
                    Questions: {exam.questions.length}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/exams/${exam._id}/edit`} className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                  <Link to={`/exams/${exam._id}/submissions`} className="btn btn-sm btn-outline-info">
                    <i className="bi bi-file-earmark-text"></i> Results
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteExam(exam._id)}
                  >
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Exam</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Exam Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    placeholder="Enter exam title"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                    placeholder="Enter exam description"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: parseInt(e.target.value) })}
                  />
                </div>

                <hr />
                <h6>Add Questions</h6>

                <div className="mb-3">
                  <label className="form-label">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    placeholder="Enter question"
                  />
                </div>

                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="mb-2">
                    <label className="form-label">Option {index + 1}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      placeholder={`Enter option ${index + 1}`}
                    />
                  </div>
                ))}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-select"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Marks</label>
                    <input
                      type="number"
                      className="form-control"
                      value={currentQuestion.marks}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button className="btn btn-outline-primary mb-3" onClick={handleAddQuestion}>
                  <i className="bi bi-plus"></i> Add Question
                </button>

                <div>
                  <h6>Added Questions ({newExam.questions.length})</h6>
                  {newExam.questions.map((q, index) => (
                    <div key={index} className="border p-2 mb-2">
                      <strong>{q.question}</strong>
                      <ul>
                        {q.options.map((opt, i) => (
                          <li key={i} className={i === q.correctAnswer ? 'text-success fw-bold' : ''}>
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <small>Marks: {q.marks}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateExam}>
                  Create Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;