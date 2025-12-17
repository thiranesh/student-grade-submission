import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GradeCalculator.css';

function GradeCalculator({ currentUser }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (currentUser?.studentId) {
      fetchStudentGrades();
    } else {
      setSubjects([{ name: '', grade: '', credits: '' }]);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchStudentGrades = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/grades?studentId=${currentUser.studentId}`);
      const grades = response.data;
      
      if (grades.length > 0) {
        const formattedSubjects = grades.map(grade => ({
          name: grade.subject,
          grade: grade.grade.toString(),
          credits: '3' // Default credits, can be made configurable
        }));
        setSubjects(formattedSubjects);
      } else {
        setSubjects([{ name: '', grade: '', credits: '' }]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grades:', error);
      setSubjects([{ name: '', grade: '', credits: '' }]);
      setLoading(false);
    }
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', grade: '', credits: '' }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  };

  const updateSubject = (index, field, value) => {
    const updated = subjects.map((subject, i) => 
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updated);
  };

  const calculateGPA = () => {
    const validSubjects = subjects.filter(s => s.grade && s.credits);
    if (validSubjects.length === 0) return 0;

    const totalPoints = validSubjects.reduce((sum, subject) => {
      const gradePoint = getGradePoint(parseFloat(subject.grade));
      return sum + (gradePoint * parseFloat(subject.credits));
    }, 0);

    const totalCredits = validSubjects.reduce((sum, subject) => 
      sum + parseFloat(subject.credits), 0
    );

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getGradePoint = (percentage) => {
    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.7;
    if (percentage >= 70) return 3.3;
    if (percentage >= 60) return 3.0;
    if (percentage >= 50) return 2.7;
    if (percentage >= 40) return 2.0;
    return 0.0;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  };

  const getOverallPercentage = () => {
    const validSubjects = subjects.filter(s => s.grade && s.credits);
    if (validSubjects.length === 0) return 0;

    const totalWeightedGrades = validSubjects.reduce((sum, subject) => 
      sum + (parseFloat(subject.grade) * parseFloat(subject.credits)), 0
    );

    const totalCredits = validSubjects.reduce((sum, subject) => 
      sum + parseFloat(subject.credits), 0
    );

    return totalCredits > 0 ? (totalWeightedGrades / totalCredits).toFixed(1) : 0;
  };

  const clearAll = () => {
    setSubjects([{ name: '', grade: '', credits: '' }]);
    setManualMode(true);
  };

  const toggleMode = () => {
    if (manualMode) {
      fetchStudentGrades();
      setManualMode(false);
    } else {
      setSubjects([{ name: '', grade: '', credits: '' }]);
      setManualMode(true);
    }
  };

  if (loading) {
    return (
      <div className="calculator-loading">
        <h2>🧮 Loading your grades...</h2>
      </div>
    );
  }

  return (
    <div className="calculator-container">
      <h1>🧮 Grade Calculator</h1>
      
      {currentUser && (
        <div className="calculator-header">
          <h2>👨🎓 {currentUser.name}'s GPA Calculator</h2>
          <div className="mode-toggle">
            <button 
              onClick={toggleMode}
              className={`mode-btn ${!manualMode ? 'active' : ''}`}
            >
              {manualMode ? '🔄 Load My Grades' : '✅ Auto-Loaded'}
            </button>
            <button 
              onClick={toggleMode}
              className={`mode-btn ${manualMode ? 'active' : ''}`}
            >
              {manualMode ? '✅ Manual Mode' : '✏️ Manual Mode'}
            </button>
          </div>
        </div>
      )}
      
      <div className="calculator-card">
        <div className="subjects-section">
          <h3>📚 {manualMode || !currentUser ? 'Add Your Subjects' : 'Your Current Grades'}</h3>
          
          {!manualMode && currentUser && subjects.length > 0 && subjects[0].name && (
            <div className="auto-load-info">
              <p>✨ Your grades have been automatically loaded from your academic record!</p>
              <p>You can adjust credits or switch to manual mode to add more subjects.</p>
            </div>
          )}
          
          <div className="subject-headers">
            <span className="header-label">📚 Subject Name</span>
            <span className="header-label">📊 Grade (%)</span>
            <span className="header-label">⭐ Credits</span>
            <span className="header-label">🎯 Letter</span>
            <span className="header-label"></span>
          </div>
          
          {subjects.map((subject, index) => (
            <div key={index} className="subject-row">
              <input
                type="text"
                placeholder="e.g., Mathematics"
                value={subject.name}
                onChange={(e) => updateSubject(index, 'name', e.target.value)}
                className="subject-input"
              />
              <input
                type="number"
                placeholder="0-100"
                min="0"
                max="100"
                value={subject.grade}
                onChange={(e) => updateSubject(index, 'grade', e.target.value)}
                className="grade-input"
              />
              <input
                type="number"
                placeholder="1-10"
                min="1"
                max="10"
                value={subject.credits}
                onChange={(e) => updateSubject(index, 'credits', e.target.value)}
                className="credits-input"
              />
              {subject.grade ? (
                <span className="letter-grade">
                  {getLetterGrade(parseFloat(subject.grade))}
                </span>
              ) : (
                <span className="letter-grade placeholder">-</span>
              )}
              <button 
                onClick={() => removeSubject(index)}
                className="remove-btn"
                disabled={subjects.length === 1}
              >
                ❌
              </button>
            </div>
          ))}
          
          <div className="action-buttons">
            <button onClick={addSubject} className="add-btn">
              ➕ Add Subject
            </button>
            <button onClick={clearAll} className="clear-btn">
              🗑️ Clear All
            </button>
            {currentUser && !manualMode && (
              <button onClick={fetchStudentGrades} className="refresh-btn">
                🔄 Refresh Grades
              </button>
            )}
          </div>
        </div>

        <div className="results-section">
          <h3>📊 Your Results</h3>
          
          <div className="result-cards">
            <div className="result-card gpa-card">
              <div className="result-icon">🎯</div>
              <div className="result-info">
                <h4>GPA</h4>
                <p className="result-value">{calculateGPA()}</p>
                <span className="result-scale">/ 4.0</span>
              </div>
            </div>
            
            <div className="result-card percentage-card">
              <div className="result-icon">📈</div>
              <div className="result-info">
                <h4>Overall %</h4>
                <p className="result-value">{getOverallPercentage()}%</p>
                <span className="result-grade">
                  {getLetterGrade(parseFloat(getOverallPercentage()))}
                </span>
              </div>
            </div>
            
            <div className="result-card subjects-card">
              <div className="result-icon">📚</div>
              <div className="result-info">
                <h4>Subjects</h4>
                <p className="result-value">
                  {subjects.filter(s => s.grade && s.credits).length}
                </p>
                <span className="result-scale">completed</span>
              </div>
            </div>
          </div>

          <div className="grade-scale">
            <h4>📋 Grading Scale</h4>
            <div className="scale-grid">
              <div className="scale-item">A+ (90-100%)</div>
              <div className="scale-item">A (80-89%)</div>
              <div className="scale-item">B+ (70-79%)</div>
              <div className="scale-item">B (60-69%)</div>
              <div className="scale-item">C+ (50-59%)</div>
              <div className="scale-item">C (40-49%)</div>
              <div className="scale-item fail">F (Below 40%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeCalculator;