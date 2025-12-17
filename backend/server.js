const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Add update and delete routes
const updateGradeRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, studentName, subject, grade } = req.body;
    
    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      { studentId, studentName, subject, grade },
      { new: true, runValidators: true }
    );
    
    if (!updatedGrade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    
    res.json(updatedGrade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteGradeRoute = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedGrade = await Grade.findByIdAndDelete(id);
    
    if (!deletedGrade) {
      return res.status(404).json({ error: 'Grade not found' });
    }
    
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://student-grades-frontend-m6xs.onrender.com'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subjects: [{ type: String }],
  department: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Grade Schema
const gradeSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: Number, required: true, min: 0, max: 100 },
  submittedAt: { type: Date, default: Date.now }
});

const Teacher = mongoose.model('Teacher', teacherSchema);
const Student = mongoose.model('Student', studentSchema);
const Grade = mongoose.model('Grade', gradeSchema);

// Student Routes
app.post('/api/students/register', async (req, res) => {
  try {
    const { studentId, name, email, phone, dateOfBirth, address, profilePicture, password } = req.body;
    
    if (!studentId || !name || !email || !phone || !dateOfBirth || !address || !password) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }
    
    const existingStudent = await Student.findOne({ $or: [{ studentId }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ error: 'Student ID or Email already exists' });
    }
    
    const student = new Student({ 
      studentId, 
      name, 
      email, 
      phone, 
      dateOfBirth, 
      address, 
      profilePicture: profilePicture || '',
      password 
    });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully', studentId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/students/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    
    const student = await Student.findOne({ studentId, password });
    if (!student) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      message: 'Login successful', 
      student: { 
        studentId: student.studentId, 
        name: student.name,
        email: student.email,
        phone: student.phone,
        dateOfBirth: student.dateOfBirth,
        address: student.address,
        profilePicture: student.profilePicture
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Teacher Login Route
app.post('/api/teacher/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Teacher login attempt:', { username, password });
    
    const teachers = {
      'math_teacher': {
        teacherId: 'TCH001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '+1-555-0123',
        subjects: ['Mathematics', 'Statistics', 'Algebra'],
        department: 'Mathematics Department',
        profilePicture: '',
        createdAt: new Date('2023-01-15')
      },
      'science_teacher': {
        teacherId: 'TCH002',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@school.edu',
        phone: '+1-555-0124',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        department: 'Science Department',
        profilePicture: '',
        createdAt: new Date('2023-02-10')
      },
      'english_teacher': {
        teacherId: 'TCH003',
        name: 'Ms. Emily Davis',
        email: 'emily.davis@school.edu',
        phone: '+1-555-0125',
        subjects: ['English Literature', 'Creative Writing', 'Grammar'],
        department: 'Language Arts Department',
        profilePicture: '',
        createdAt: new Date('2023-03-05')
      },
      'history_teacher': {
        teacherId: 'TCH004',
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@school.edu',
        phone: '+1-555-0126',
        subjects: ['World History', 'Geography', 'Social Studies'],
        department: 'Social Sciences Department',
        profilePicture: '',
        createdAt: new Date('2023-01-20')
      },
      'cs_teacher': {
        teacherId: 'TCH005',
        name: 'Dr. Lisa Rodriguez',
        email: 'lisa.rodriguez@school.edu',
        phone: '+1-555-0127',
        subjects: ['Computer Science', 'Programming', 'Web Development'],
        department: 'Technology Department',
        profilePicture: '',
        createdAt: new Date('2023-04-12')
      }
    };
    
    const teacher = teachers[username];
    console.log('Found teacher:', teacher);
    console.log('Password check:', password === 'teacher123');
    
    if (teacher && password === 'teacher123') {
      console.log('Login successful for:', teacher.name);
      res.json({ message: 'Login successful', teacher });
    } else {
      console.log('Login failed for username:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Teacher Profile Route (now uses stored teacher data)
app.get('/api/teacher/profile/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teachers = {
      'TCH001': {
        teacherId: 'TCH001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@school.edu',
        phone: '+1-555-0123',
        subjects: ['Mathematics', 'Statistics', 'Algebra'],
        department: 'Mathematics Department',
        profilePicture: '',
        createdAt: new Date('2023-01-15')
      },
      'TCH002': {
        teacherId: 'TCH002',
        name: 'Prof. Michael Chen',
        email: 'michael.chen@school.edu',
        phone: '+1-555-0124',
        subjects: ['Physics', 'Chemistry', 'Biology'],
        department: 'Science Department',
        profilePicture: '',
        createdAt: new Date('2023-02-10')
      },
      'TCH003': {
        teacherId: 'TCH003',
        name: 'Ms. Emily Davis',
        email: 'emily.davis@school.edu',
        phone: '+1-555-0125',
        subjects: ['English Literature', 'Creative Writing', 'Grammar'],
        department: 'Language Arts Department',
        profilePicture: '',
        createdAt: new Date('2023-03-05')
      },
      'TCH004': {
        teacherId: 'TCH004',
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@school.edu',
        phone: '+1-555-0126',
        subjects: ['World History', 'Geography', 'Social Studies'],
        department: 'Social Sciences Department',
        profilePicture: '',
        createdAt: new Date('2023-01-20')
      },
      'TCH005': {
        teacherId: 'TCH005',
        name: 'Dr. Lisa Rodriguez',
        email: 'lisa.rodriguez@school.edu',
        phone: '+1-555-0127',
        subjects: ['Computer Science', 'Programming', 'Web Development'],
        department: 'Technology Department',
        profilePicture: '',
        createdAt: new Date('2023-04-12')
      }
    };
    
    const teacher = teachers[teacherId];
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics Route
app.get('/api/analytics', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalGrades = await Grade.countDocuments();
    
    const gradeDistribution = await Grade.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lt: ['$grade', 40] }, then: 'Arrear' },
                { case: { $lt: ['$grade', 50] }, then: 'Pass' },
                { case: { $lt: ['$grade', 60] }, then: 'Second Class' },
                { case: { $lt: ['$grade', 75] }, then: 'First Class' },
              ],
              default: 'Distinction'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const subjectStats = await Grade.aggregate([
      {
        $group: {
          _id: '$subject',
          averageGrade: { $avg: '$grade' },
          totalStudents: { $sum: 1 },
          maxGrade: { $max: '$grade' },
          minGrade: { $min: '$grade' }
        }
      }
    ]);
    
    res.json({
      totalStudents,
      totalGrades,
      gradeDistribution,
      subjectStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Grade Routes
app.get('/api/grades', async (req, res) => {
  try {
    const { studentId } = req.query;
    let query = {};
    
    if (studentId) {
      query.studentId = studentId;
    }
    
    const grades = await Grade.find(query).sort({ submittedAt: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/grades', async (req, res) => {
  try {
    const { studentId, studentName, subject, grade } = req.body;
    
    if (!studentId || !studentName || !subject || !grade) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const newGrade = new Grade({ studentId, studentName, subject, grade });
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Thiranesh:thiran2026@lms.ggsssvk.mongodb.net/student-grades';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('🌐 Database: student-grades');
  })
  .catch(err => {
    console.log('❌ MongoDB Atlas connection error:', err.message);
    console.log('🔗 Trying to connect to Atlas cluster...');
  });

// Add the routes
app.put('/api/grades/:id', updateGradeRoute);
app.delete('/api/grades/:id', deleteGradeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connected to MongoDB Atlas');
});