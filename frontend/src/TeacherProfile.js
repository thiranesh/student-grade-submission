import React from 'react';
import './TeacherProfile.css';

function TeacherProfile({ teacherData }) {
  // Use teacherData directly without state management
  const teacher = teacherData;

  if (!teacher) {
    return (
      <div className="teacher-error">
        <h2>❌ No teacher data available</h2>
        <p>Please login again</p>
      </div>
    );
  }

  return (
    <div className="teacher-profile-container">
      <h1>👨🏫 Teacher Profile</h1>
      
      <div className="teacher-profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {teacher.profilePicture ? (
              <img src={teacher.profilePicture} alt="Teacher Profile" />
            ) : (
              <div className="avatar-placeholder">
                {teacher.name?.charAt(0) || '👨🏫'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{teacher.name}</h2>
            <p className="teacher-id">🆔 {teacher.teacherId}</p>
            <p className="department">🏢 {teacher.department}</p>
          </div>
          <div className="profile-badge">
            <span className="badge-text">Teacher</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="details-grid">
            <div className="detail-section">
              <h3>📞 Contact Information</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{teacher.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📱 Phone:</span>
                  <span className="detail-value">{teacher.phone}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>📚 Teaching Information</h3>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">🏢 Department:</span>
                  <span className="detail-value">{teacher.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Joined:</span>
                  <span className="detail-value">
                    {new Date(teacher.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="subjects-section">
            <h3>📖 Subjects Teaching</h3>
            <div className="subjects-grid">
              {teacher.subjects.map((subject, index) => (
                <div key={index} className="subject-chip">
                  <span className="subject-icon">📚</span>
                  <span className="subject-name">{subject}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h3>📊 Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <h4>{teacher.subjects.length}</h4>
                  <p>Subjects</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⏰</div>
                <div className="stat-info">
                  <h4>{Math.floor((new Date() - new Date(teacher.createdAt)) / (1000 * 60 * 60 * 24 * 365))}</h4>
                  <p>Years Experience</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🎯</div>
                <div className="stat-info">
                  <h4>Active</h4>
                  <p>Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherProfile;