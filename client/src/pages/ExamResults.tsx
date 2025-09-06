import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ExamSubmission {
  _id: string;
  examId: string;
  studentId: string;
  answers: number[];
  score: number;
  timeTaken: number;
  submittedAt: string;
  totalMarks: number;
}

interface Exam {
  _id: string;
  title: string;
  description: string;
  totalMarks: number;
}

const ExamResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<ExamSubmission[]>([]);
  const [exams, setExams] = useState<{ [key: string]: Exam }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    try {
      // Fetch exam results for the current user
      const resultsResponse = await fetch(`http://localhost:5000/api/exams/results/${user?._id}`);
      const resultsData = await resultsResponse.json();
      setResults(resultsData);

      // Fetch all exams to get titles
      const examsResponse = await fetch('http://localhost:5000/api/exams');
      const examsData = await examsResponse.json();

      const examsMap: { [key: string]: Exam } = {};
      examsData.forEach((exam: Exam) => {
        examsMap[exam._id] = exam;
      });
      setExams(examsMap);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return <div className="text-center mt-5">Loading results...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">My Exam Results</h1>

      {results.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No exam results found</h4>
          <p>You haven't taken any exams yet.</p>
        </div>
      ) : (
        <div className="row">
          {results.map(result => {
            const exam = exams[result.examId];
            const percentage = ((result.score / result.totalMarks) * 100).toFixed(1);

            return (
              <div key={result._id} className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      {exam ? exam.title : 'Unknown Exam'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row text-center mb-3">
                      <div className="col-4">
                        <h4 className="text-primary">{result.score}</h4>
                        <small>Score</small>
                      </div>
                      <div className="col-4">
                        <h4 className="text-success">{result.totalMarks}</h4>
                        <small>Total</small>
                      </div>
                      <div className="col-4">
                        <h4 className={`${
                          parseFloat(percentage) >= 80 ? 'text-success' :
                          parseFloat(percentage) >= 60 ? 'text-warning' : 'text-danger'
                        }`}>
                          {percentage}%
                        </h4>
                        <small>Percentage</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="progress">
                        <div
                          className={`progress-bar ${
                            parseFloat(percentage) >= 80 ? 'bg-success' :
                            parseFloat(percentage) >= 60 ? 'bg-warning' : 'bg-danger'
                          }`}
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={parseFloat(percentage)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          {percentage}%
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-clock"></i> Time Taken: {formatTime(result.timeTaken)}
                        </small>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">
                          <i className="bi bi-calendar"></i> Submitted: {formatDate(result.submittedAt)}
                        </small>
                      </div>
                    </div>

                    <div className="mt-3">
                      {parseFloat(percentage) >= 80 && (
                        <span className="badge bg-success">Excellent</span>
                      )}
                      {parseFloat(percentage) >= 60 && parseFloat(percentage) < 80 && (
                        <span className="badge bg-warning">Good</span>
                      )}
                      {parseFloat(percentage) < 60 && (
                        <span className="badge bg-danger">Needs Improvement</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Statistics */}
      {results.length > 0 && (
        <div className="card mt-4">
          <div className="card-header">
            <h5>Performance Summary</h5>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-md-3">
                <h4>{results.length}</h4>
                <small>Total Exams</small>
              </div>
              <div className="col-md-3">
                <h4>
                  {results.length > 0
                    ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
                    : '0'
                  }
                </h4>
                <small>Average Score</small>
              </div>
              <div className="col-md-3">
                <h4>
                  {results.length > 0
                    ? ((results.reduce((sum, r) => sum + r.score, 0) / results.reduce((sum, r) => sum + r.totalMarks, 0)) * 100).toFixed(1)
                    : '0'
                  }%
                </h4>
                <small>Overall Average</small>
              </div>
              <div className="col-md-3">
                <h4>
                  {results.filter(r => (r.score / r.totalMarks) * 100 >= 60).length}
                </h4>
                <small>Passed</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;