import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin, onShowRegister }) {
  const [activeTab, setActiveTab] = useState('teacher');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'teacher') {
      // Teacher login (multiple teachers)
      try {
        const response = await axios.post('http://localhost:5000/api/teacher/login', {
          username: credentials.username,
          password: credentials.password
        });
        
        if (response.data.teacher) {
          onLogin('teacher', response.data.teacher);
        }
      } catch (error) {
        alert('Invalid teacher credentials!');
      }
    } else {
      // Student login (database check)
      try {
        const response = await axios.post('http://localhost:5000/api/students/login', {
          studentId: credentials.username,
          password: credentials.password
        });
        
        if (response.data.student) {
          onLogin('student', response.data.student);
        }
      } catch (error) {
        alert('Invalid student credentials!');
      }
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCredentials({ username: '', password: '' });
  };

  // Debug: Check if onShowRegister is passed
  console.log('onShowRegister prop:', onShowRegister);

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-section">
          <div className="logo-icon">🎓</div>
          <h3>EduGrade Portal</h3>
          <p className="subtitle">Secure Academic Management</p>
        </div>
        
        <div className="tab-container">
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => switchTab('teacher')}
          >
            👨‍🏫 Teacher Login
          </button>
          <button 
            type="button"
            className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => switchTab('student')}
          >
            👨‍🎓 Student Login
          </button>
        </div>
        
        <div className="input-group">
          <label htmlFor="username">{activeTab === 'teacher' ? '👨‍🏫' : '👨‍🎓'} Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder={`Enter ${activeTab} username`}
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">🔒 Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" className="login-btn">
            <span className="btn-text">
              {activeTab === 'teacher' ? '🚀 Login as Teacher' : '📚 Login as Student'}
            </span>
            <div className="btn-ripple"></div>
          </button>
          
          {activeTab === 'student' && (
            <button type="button" className="register-link" onClick={onShowRegister}>
              📝 New Student? Register Here
            </button>
          )}
        </div>
        
        <div className="login-footer">
          <p>Secure • Reliable • Fast</p>
        </div>
      </form>
    </div>
  );
}

export default Login;