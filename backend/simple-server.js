const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory storage
let grades = [];
let idCounter = 1;

// Routes
app.get('/api/grades', (req, res) => {
  const { studentId } = req.query;
  let filteredGrades = grades;
  
  if (studentId) {
    filteredGrades = grades.filter(grade => grade.studentId === studentId);
  }
  
  res.json(filteredGrades.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
});

app.post('/api/grades', (req, res) => {
  const { studentId, studentName, subject, grade } = req.body;
  
  if (!studentId || !studentName || !subject || !grade) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const newGrade = {
    _id: idCounter++,
    studentId,
    studentName,
    subject,
    grade: Number(grade),
    submittedAt: new Date()
  };
  
  grades.push(newGrade);
  res.status(201).json(newGrade);
});

app.put('/api/grades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { studentId, studentName, subject, grade } = req.body;
  
  const gradeIndex = grades.findIndex(g => g._id === id);
  if (gradeIndex === -1) {
    return res.status(404).json({ error: 'Grade not found' });
  }
  
  grades[gradeIndex] = {
    ...grades[gradeIndex],
    studentId,
    studentName,
    subject,
    grade: Number(grade)
  };
  
  res.json(grades[gradeIndex]);
});

app.delete('/api/grades/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const gradeIndex = grades.findIndex(g => g._id === id);
  
  if (gradeIndex === -1) {
    return res.status(404).json({ error: 'Grade not found' });
  }
  
  grades.splice(gradeIndex, 1);
  res.json({ message: 'Grade deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});