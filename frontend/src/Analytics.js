import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/analytics');
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <h2>📊 Loading Analytics...</h2>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-error">
        <h2>❌ Error loading analytics</h2>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    if (grade === 'Arrear') return '#ff4757';
    if (grade === 'Pass') return '#ffa726';
    if (grade === 'Second Class') return '#42a5f5';
    if (grade === 'First Class') return '#66bb6a';
    return '#ab47bc';
  };

  return (
    <div className="analytics-container">
      <h1>📊 Grade Analytics Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{analytics.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>{analytics.totalGrades}</h3>
            <p>Total Grades</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{analytics.subjectStats.length}</h3>
            <p>Subjects</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h3>{Math.round(analytics.totalGrades / analytics.totalStudents) || 0}</h3>
            <p>Avg Grades/Student</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>🎯 Grade Distribution</h3>
          <div className="grade-distribution">
            {analytics.gradeDistribution.map((item) => (
              <div key={item._id} className="grade-bar">
                <div className="grade-label">{item._id}</div>
                <div className="grade-progress">
                  <div 
                    className="grade-fill"
                    style={{
                      width: `${(item.count / analytics.totalGrades) * 100}%`,
                      backgroundColor: getGradeColor(item._id)
                    }}
                  ></div>
                </div>
                <div className="grade-count">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>📊 Subject Performance</h3>
          <div className="subject-stats">
            {analytics.subjectStats.map((subject) => (
              <div key={subject._id} className="subject-item">
                <div className="subject-header">
                  <h4>{subject._id}</h4>
                  <span className="avg-grade">{Math.round(subject.averageGrade)}%</span>
                </div>
                <div className="subject-details">
                  <span>👥 {subject.totalStudents} students</span>
                  <span>🏆 Max: {subject.maxGrade}%</span>
                  <span>📉 Min: {subject.minGrade}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;