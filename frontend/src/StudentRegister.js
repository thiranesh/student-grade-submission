import React, { useState } from 'react';
import './StudentRegister.css';

function StudentRegister({ onBack, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    profilePicture: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Registration successful! You can now login.');
        onRegisterSuccess();
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large. Please choose an image under 2MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image if needed
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Resize image to max 300x300
          const maxSize = 300;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setFormData({ ...formData, profilePicture: compressedDataUrl });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
      </div>
      
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="logo-section">
          <div className="logo-icon">👨🎓</div>
          <h3>Student Registration</h3>
          <p className="subtitle">Create your account</p>
        </div>
        
        <div className="input-group">
          <label>🆔 Student ID</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter unique student ID"
            value={formData.studentId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>👤 Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>📷 Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="input-group">
          <label>📧 Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>📱 Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🎂 Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>🏠 Address</label>
          <textarea
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            rows="2"
            required
          />
        </div>

        <div className="input-group">
          <label>🔒 Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="register-button-group">
          <button type="submit" className="register-btn">
            🚀 Register
          </button>
          
          <button type="button" className="back-btn" onClick={onBack}>
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default StudentRegister;