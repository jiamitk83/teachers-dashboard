import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
}

const TakeExam = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (exam && examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exam, examStarted, timeLeft]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/exams/${id}`);
      if (response.ok) {
        const examData = await response.json();
        setExam(examData);
        setTimeLeft(examData.duration * 60); // Convert minutes to seconds
        setAnswers(new Array(examData.questions.length).fill(-1));
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitExam = async () => {
    if (!exam || !user) return;

    try {
      const response = await fetch(`http://localhost:5000/api/exams/${exam._id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: user._id,
          answers,
          timeTaken: exam.duration * 60 - timeLeft
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Exam submitted successfully! Your score: ${result.score}/${result.totalMarks} (${result.percentage}%)`);
        navigate('/student/exam-results');
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading exam...</div>;
  }

  if (!exam) {
    return <div className="text-center mt-5">Exam not found</div>;
  }

  if (!examStarted) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">{exam.title}</h3>
              </div>
              <div className="card-body">
                <p className="text-center">{exam.description}</p>
                <div className="row text-center mt-4">
                  <div className="col-md-4">
                    <h5>{exam.questions.length}</h5>
                    <small>Questions</small>
                  </div>
                  <div className="col-md-4">
                    <h5>{exam.duration}</h5>
                    <small>Minutes</small>
                  </div>
                  <div className="col-md-4">
                    <h5>{exam.totalMarks}</h5>
                    <small>Total Marks</small>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-success btn-lg" onClick={handleStartExam}>
                    Start Exam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = exam.questions[currentQuestion];

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Question {currentQuestion + 1} of {exam.questions.length}</h5>
              <div className="text-danger fw-bold">
                Time Left: {formatTime(timeLeft)}
              </div>
            </div>
            <div className="card-body">
              <h6 className="card-title mb-4">{question.question}</h6>
              <div className="row">
                {question.options.map((option, index) => (
                  <div key={index} className="col-md-6 mb-3">
                    <div
                      className={`card h-100 ${answers[currentQuestion] === index ? 'border-primary' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                    >
                      <div className="card-body d-flex align-items-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${currentQuestion}`}
                            checked={answers[currentQuestion] === index}
                            onChange={() => handleAnswerSelect(currentQuestion, index)}
                          />
                          <label className="form-check-label ms-2">
                            {option}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6>Question Navigator</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      answers[index] !== -1 ? 'btn-success' : 'btn-outline-secondary'
                    } ${currentQuestion === index ? 'active' : ''}`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <small>Answered: {answers.filter(a => a !== -1).length}</small>
                  <small>Total: {exam.questions.length}</small>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(answers.filter(a => a !== -1).length / exam.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            {currentQuestion === exam.questions.length - 1 ? (
              <button className="btn btn-success" onClick={handleSubmitExam}>
                Submit Exam
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;