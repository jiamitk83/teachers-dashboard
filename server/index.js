const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = 'teacherDashboardDB';
let db;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// --- Authentication Endpoints ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: role || 'student',
      studentId: role === 'parent' ? studentId : null,
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const user = await db.collection('users').findOne({ _id: result.insertedId });

    // Create JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.user._id) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json(userResponse);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// --- API Endpoints ---

// Dashboard
app.get('/api/students/count', async (req, res) => {
  try {
    const count = await db.collection('students').countDocuments();
    res.json({ count });
  } catch (e) {
    res.status(500).json({ message: 'Error fetching student count', error: e });
  }
});

app.get('/api/attendance/summary/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRecord = await db.collection('attendance').findOne({ date });
    if (attendanceRecord) {
      const summary = {
        present: attendanceRecord.records.filter(r => r.status === 'present').length,
        absent: attendanceRecord.records.filter(r => r.status === 'absent').length,
        late: attendanceRecord.records.filter(r => r.status === 'late').length,
      };
      res.json(summary);
    } else {
      res.json({ present: 0, absent: 0, late: 0 });
    }
  } catch (e) {
    res.status(500).json({ message: 'Error fetching attendance summary', error: e });
  }
});

app.get('/api/assignments/ungraded-count', async (req, res) => {
    try {
        const totalAssignments = await db.collection('assignments').countDocuments();
        const totalStudents = await db.collection('students').countDocuments();
        const gradedCount = await db.collection('grades').countDocuments();
        const ungradedCount = (totalAssignments * totalStudents) - gradedCount;
        res.json({ count: ungradedCount > 0 ? ungradedCount : 0 });
    } catch (e) {
        res.status(500).json({ message: 'Error fetching ungraded assignment count', error: e });
    }
});


// Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await db.collection('students').find({}).toArray();
    res.json(students);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching students', error: e });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, parentName, parentEmail, parentPhone } = req.body;
    const result = await db.collection('students').insertOne({ name, parentName, parentEmail, parentPhone });
    const newStudent = await db.collection('students').findOne({_id: result.insertedId});
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(500).json({ message: 'Error adding student', error: e });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentName, parentEmail, parentPhone } = req.body;
    const result = await db.collection('students').updateOne({ _id: new ObjectId(id) }, { $set: { name, parentName, parentEmail, parentPhone } });
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: 'Error updating student', error: e });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('students').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Student deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting student', error: e });
  }
});

app.get('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await db.collection('students').findOne({ _id: new ObjectId(id) });
        res.json(student);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching student', error: e });
    }
});

// Attendance
app.get('/api/attendance/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const attendanceRecord = await db.collection('attendance').findOne({ date });
    if (attendanceRecord) {
      res.json(attendanceRecord);
    } else {
      res.json({ date, records: [] });
    }
  } catch (e) {
    res.status(500).json({ message: 'Error fetching attendance', error: e });
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { date, records } = req.body;
    await db.collection('attendance').updateOne(
      { date },
      { $set: { date, records } },
      { upsert: true }
    );
    const updatedRecord = await db.collection('attendance').findOne({ date });
    res.status(201).json(updatedRecord);
  } catch (e) {
    res.status(500).json({ message: 'Error saving attendance', error: e });
  }
});

// Assignments
app.get('/api/assignments', async (req, res) => {
  try {
    const assignments = await db.collection('assignments').find({}).toArray();
    res.json(assignments);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching assignments', error: e });
  }
});

app.post('/api/assignments', async (req, res) => {
  try {
    const result = await db.collection('assignments').insertOne(req.body);
    const newAssignment = await db.collection('assignments').findOne({_id: result.insertedId});
    res.status(201).json(newAssignment);
  } catch (e) {
    res.status(500).json({ message: 'Error adding assignment', error: e });
  }
});

// Grades

// Announcements
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await db.collection('announcements').find({}).sort({ date: -1 }).toArray();
        res.json(announcements);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching announcements', error: e });
    }
});

app.post('/api/announcements', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newAnnouncement = {
            title,
            content,
            date: new Date(),
        };
        const result = await db.collection('announcements').insertOne(newAnnouncement);
        res.status(201).json(result.ops[0]);
    } catch (e) {
        res.status(500).json({ message: 'Error creating announcement', error: e });
    }
});
app.get('/api/grades', async (req, res) => {
  try {
    const grades = await db.collection('grades').find({}).toArray();
    res.json(grades);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching grades', error: e });
  }
});

app.post('/api/grades', async (req, res) => {
  try {
    const { studentId, assignmentId, score } = req.body;
    await db.collection('grades').updateOne(
      { studentId, assignmentId },
      { $set: { studentId, assignmentId, score: Number(score) } },
      { upsert: true }
    );
    const updatedGrade = await db.collection('grades').findOne({ studentId, assignmentId });
    res.status(201).json(updatedGrade);
  } catch (e) {
    res.status(500).json({ message: 'Error saving grade', error: e });
  }
});

// --- Examination Module Endpoints ---

// Get all exams
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await db.collection('exams').find({}).toArray();
    res.json(exams);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching exams', error: e });
  }
});

// Create new exam
app.post('/api/exams', async (req, res) => {
  try {
    const { title, description, questions, duration, totalMarks, assignedTo } = req.body;
    const newExam = {
      title,
      description,
      questions,
      duration,
      totalMarks,
      assignedTo,
      createdAt: new Date(),
      createdBy: req.user?.email || 'admin'
    };
    const result = await db.collection('exams').insertOne(newExam);
    const createdExam = await db.collection('exams').findOne({ _id: result.insertedId });
    res.status(201).json(createdExam);
  } catch (e) {
    res.status(500).json({ message: 'Error creating exam', error: e });
  }
});

// Get exam by ID
app.get('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching exam', error: e });
  }
});

// Update exam
app.put('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions, duration, totalMarks, assignedTo } = req.body;
    const result = await db.collection('exams').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, questions, duration, totalMarks, assignedTo, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    const updatedExam = await db.collection('exams').findOne({ _id: new ObjectId(id) });
    res.json(updatedExam);
  } catch (e) {
    res.status(500).json({ message: 'Error updating exam', error: e });
  }
});

// Delete exam
app.delete('/api/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('exams').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json({ message: 'Exam deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting exam', error: e });
  }
});

// Submit exam answers
app.post('/api/exams/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, answers, timeTaken } = req.body;

    const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Calculate score
    let score = 0;
    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += question.marks || 1;
      }
    });

    const submission = {
      examId: id,
      studentId,
      answers,
      score,
      timeTaken,
      submittedAt: new Date(),
      totalMarks: exam.totalMarks
    };

    const result = await db.collection('exam_submissions').insertOne(submission);
    res.status(201).json({
      submissionId: result.insertedId,
      score,
      totalMarks: exam.totalMarks,
      percentage: ((score / exam.totalMarks) * 100).toFixed(2)
    });
  } catch (e) {
    res.status(500).json({ message: 'Error submitting exam', error: e });
  }
});

// Get exam results for a student
app.get('/api/exams/results/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await db.collection('exam_submissions').find({ studentId }).toArray();
    res.json(results);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching exam results', error: e });
  }
});

// Get all exam submissions for an exam
app.get('/api/exams/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;
    const submissions = await db.collection('exam_submissions').find({ examId: id }).toArray();
    res.json(submissions);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching exam submissions', error: e });
  }
});


// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@school.com' });
    if (!existingAdmin) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      const adminUser = {
        name: 'System Administrator',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      };

      await db.collection('users').insertOne(adminUser);
      console.log('✅ Default admin account created:');
      console.log('   Email: admin@school.com');
      console.log('   Password: admin123');
      console.log('   Role: Administrator');
    } else {
      console.log('ℹ️  Default admin account already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// --- Server Initialization ---
const startServer = async () => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName}`);

    // Create default admin account
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Failed to connect to MongoDB', e);
    process.exit(1);
  }
};

startServer();