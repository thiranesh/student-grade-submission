import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import StudentRegister from './StudentRegister';
import Analytics from './Analytics';
import GradeCalculator from './GradeCalculator';
import TeacherProfile from './TeacherProfile';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('submit');
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    subject: '',
    grade: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn === 'teacher') {
      fetchGrades();
      fetchStudents();
      if (currentUser) {
        fetchTeacherProfile();
      }
    } else if (isLoggedIn === 'student' && currentUser) {
      fetchGrades(currentUser.studentId);
    }
  }, [isLoggedIn, currentUser]);

  // Debug: Log current user data
  useEffect(() => {
    console.log('Current User Data:', currentUser);
    if (isLoggedIn === 'teacher' && currentUser) {
      setTeacherProfile(currentUser);
      console.log('Teacher Profile Set:', currentUser);
    }
  }, [currentUser, isLoggedIn]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeacherProfile = async () => {
    try {
      if (currentUser?.teacherId) {
        const response = await axios.get(`http://localhost:5000/api/teacher/profile/${currentUser.teacherId}`);
        setTeacherProfile(response.data);
      } else if (currentUser) {
        // If currentUser exists but no teacherId, use the currentUser data directly
        setTeacherProfile(currentUser);
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      // Fallback to using currentUser data if API fails
      if (currentUser) {
        setTeacherProfile(currentUser);
      }
    }
  };

  const fetchGrades = async (studentId = '') => {
    try {
      const url = studentId 
        ? `http://localhost:5000/api/grades?studentId=${studentId}`
        : 'http://localhost:5000/api/grades';
      const response = await axios.get(url);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/grades/${editingId}`, formData);
        setEditingId(null);
        alert('Grade updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/grades', formData);
        alert('Grade submitted successfully!');
      }
      setFormData({ studentId: '', studentName: '', subject: '', grade: '' });
      fetchGrades();
    } catch (error) {
      console.error('Error:', error);
      alert('Error. Check console and ensure backend is running.');
    }
  };

  const handleEdit = (grade) => {
    setFormData({
      studentId: grade.studentId,
      studentName: grade.studentName,
      subject: grade.subject,
      grade: grade.grade
    });
    setEditingId(grade._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade?')) {
      try {
        await axios.delete(`http://localhost:5000/api/grades/${id}`);
        fetchGrades();
        alert('Grade deleted successfully!');
      } catch (error) {
        console.error('Error deleting grade:', error);
        alert('Error deleting grade.');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ studentId: '', studentName: '', subject: '', grade: '' });
    setEditingId(null);
  };

  const handleLogin = (userType, userData) => {
    setIsLoggedIn(userType);
    setCurrentUser(userData);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const getGradeStatus = (grade) => {
    if (grade < 40) return { status: 'ARREAR', class: 'arrear' };
    if (grade < 50) return { status: 'PASS', class: 'pass' };
    if (grade < 60) return { status: 'SECOND CLASS', class: 'second' };
    if (grade < 75) return { status: 'FIRST CLASS', class: 'first' };
    return { status: 'DISTINCTION', class: 'distinction' };
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderSubmitPage = () => {
    if (isLoggedIn === 'student') {
      return (
        <div className="page-container">
          <div className="profile-page">
            <h1>👤 My Profile</h1>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  {currentUser?.profilePicture ? (
                    <img src={currentUser.profilePicture} alt="Profile" />
                  ) : (
                    <div className="avatar-placeholder">
                      {currentUser?.name?.charAt(0) || '👤'}
                    </div>
                  )}
                </div>
                <div className="profile-name">
                  <h2>{currentUser?.name}</h2>
                  <p className="student-id">🆔 {currentUser?.studentId}</p>
                </div>
              </div>
              
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{currentUser?.email || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📱 Phone:</span>
                  <span className="detail-value">{currentUser?.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🎂 Date of Birth:</span>
                  <span className="detail-value">{currentUser?.dateOfBirth || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🏠 Address:</span>
                  <span className="detail-value">{currentUser?.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Joined:</span>
                  <span className="detail-value">{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="page-container">
        <div className="submit-page">
          <h1>{editingId ? '✏️ Edit Grade' : '📝 Submit New Grade'}</h1>
          <form onSubmit={handleSubmit} className="grade-form">
            <select
              name="studentId"
              value={formData.studentId}
              onChange={(e) => {
                const selectedStudent = students.find(s => s.studentId === e.target.value);
                setFormData({
                  ...formData,
                  studentId: e.target.value,
                  studentName: selectedStudent ? selectedStudent.name : ''
                });
              }}
              required
            >
              <option value="">🆔 Select Student</option>
              {students.map(student => (
                <option key={student.studentId} value={student.studentId}>
                  {student.studentId} - {student.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="studentName"
              placeholder="👤 Student Name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">📚 Select Subject</option>
              {teacherProfile?.subjects?.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="grade"
              placeholder="🎯 Grade (0-100)"
              min="0"
              max="100"
              value={formData.grade}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {editingId ? '✅ Update Grade' : '🚀 Submit Grade'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}>
                ❌ Cancel
              </button>
            )}
          </form>
        </div>
      </div>
    );
  };

  const renderViewPage = () => {
    if (isLoggedIn === 'student') {
      return (
        <div className="view-page">
          <h1>📊 My Grades - {currentUser?.name}</h1>
          {grades.length === 0 ? (
            <div className="empty-state">
              <h3>📋 No grades available</h3>
              <p>Your teacher hasn't assigned any grades yet</p>
            </div>
          ) : (
            <div className="grades-grid">
              {grades.map((grade) => (
                <div key={grade._id} className="grade-card student-card">
                  <div className="grade-info">
                    <strong>📚 {grade.subject}</strong>
                    <div className={`grade-score ${getGradeStatus(grade.grade).class}`}>
                      {grade.grade}% - {getGradeStatus(grade.grade).status}
                    </div>
                    <div className="grade-date">
                      📅 {new Date(grade.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="view-page">
        <h1>📊 All Student Grades</h1>
        {grades.length === 0 ? (
          <div className="empty-state">
            <h3>📋 No grades submitted yet</h3>
            <p>Start by submitting your first grade!</p>
          </div>
        ) : (
          <div className="grades-grid">
            {grades.map((grade) => (
              <div key={grade._id} className="grade-card">
                <div className="grade-info">
                  <strong>👤 {grade.studentName} (ID: {grade.studentId})</strong>
                  <div className="grade-subject">📚 {grade.subject}</div>
                  <div className={`grade-score ${getGradeStatus(grade.grade).class}`}>
                    {grade.grade}% - {getGradeStatus(grade.grade).status}
                  </div>
                  <div className="grade-date">
                    📅 {new Date(grade.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="grade-actions">
                  <button onClick={() => { handleEdit(grade); setCurrentPage('submit'); }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(grade._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (showRegister) {
    return (
      <StudentRegister 
        onBack={handleBackToLogin}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  if (!isLoggedIn) {
    return (
      <Login 
        onLogin={handleLogin}
        onShowRegister={handleShowRegister}
      />
    );
  }

  return (
    <div className="App">
      <nav className="navigation">
        <div className={`nav-left ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <button 
            className={currentPage === 'submit' ? 'active' : ''}
            onClick={() => {
              setCurrentPage('submit');
              setMobileMenuOpen(false);
            }}
          >
            {isLoggedIn === 'teacher' ? '📝 Submit Grade' : '👤 My Profile'}
          </button>
          <button 
            className={currentPage === 'view' ? 'active' : ''}
            onClick={() => {
              setCurrentPage('view');
              setMobileMenuOpen(false);
            }}
          >
            {isLoggedIn === 'teacher' ? '📊 View Grades' : '📚 My Grades'}
          </button>
          {isLoggedIn === 'teacher' && (
            <>
              <button 
                className={currentPage === 'analytics' ? 'active' : ''}
                onClick={() => {
                  setCurrentPage('analytics');
                  setMobileMenuOpen(false);
                }}
              >
                📈 Analytics
              </button>
              <button 
                className={currentPage === 'profile' ? 'active' : ''}
                onClick={() => {
                  setCurrentPage('profile');
                  setMobileMenuOpen(false);
                }}
              >
                👨🏫 My Profile
              </button>
            </>
          )}
          {isLoggedIn === 'student' && (
            <button 
              className={currentPage === 'calculator' ? 'active' : ''}
              onClick={() => {
                setCurrentPage('calculator');
                setMobileMenuOpen(false);
              }}
            >
              🧮 Calculator
            </button>
          )}
          <div className="mobile-logout-section">
            <button className="mobile-logout-btn" onClick={() => {
              setIsLoggedIn(false);
              setCurrentUser(null);
              setGrades([]);
              setMobileMenuOpen(false);
            }}>
              🚀 Logout
            </button>
          </div>
        </div>
        
        <div className="user-info">
          <span className="user-type">
            {isLoggedIn === 'teacher' 
              ? `👨🏫 ${currentUser?.name || 'Teacher'}` 
              : `👨🎓 ${currentUser?.name || 'Student'}`
            }
          </span>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </button>
          <button className="desktop-logout-btn" onClick={() => {
            setIsLoggedIn(false);
            setCurrentUser(null);
            setGrades([]);
            setMobileMenuOpen(false);
          }}>
            Logout
          </button>
        </div>
      </nav>
      
      {currentPage === 'submit' && renderSubmitPage()}
      {currentPage === 'view' && renderViewPage()}
      {currentPage === 'analytics' && isLoggedIn === 'teacher' && <Analytics />}
      {currentPage === 'profile' && isLoggedIn === 'teacher' && (
        <TeacherProfile 
          key={currentUser?.teacherId || 'teacher'} 
          teacherData={currentUser} 
        />
      )}
      {currentPage === 'calculator' && isLoggedIn === 'student' && <GradeCalculator currentUser={currentUser} />}
    </div>
  );
}

export default App;