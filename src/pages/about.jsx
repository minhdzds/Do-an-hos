import React from 'react';
import '../assets/css/about.css';

export default function About() {
  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About Us</h1>
        <p>Providing world-class healthcare with compassion, excellence, and dedication to our community.</p>
      </div>

      <div className="container">
        {/* INTRODUCTION */}
        <div className="about-intro">
          <h2>Our History & Legacy</h2>
          <p style={{ color: '#555', fontSize: '16px' }}>
            Established with the goal of becoming a leading medical center, our clinic has continuously grown over the years. We take pride in gathering top-tier medical experts, investing in modern equipment, and maintaining a patient-centric approach to deliver the safest and most effective treatments.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="mv-container">
          <div className="mv-box">
            <h3>🎯 Our Mission</h3>
            <p>
              To provide the highest quality healthcare services, ensuring patient safety and satisfaction. We are committed to continuous medical research and training to elevate community health standards.
            </p>
          </div>
          <div className="mv-box">
            <h3>👁️ Our Vision</h3>
            <p>
              To become the most trusted healthcare institution in the region, recognized for clinical excellence, innovative medical technology, and comprehensive patient care.
            </p>
          </div>
        </div>
      </div>

      {/* CORE VALUES */}
      <div className="core-values-section">
        <div className="container">
          <h2 style={{ textAlign: 'center', color: '#0b3b60', fontSize: '32px' }}>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i>❤️</i>
              <h4>Compassion</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>Treating every patient with empathy, kindness, and respect.</p>
            </div>
            <div className="value-card">
              <i>⭐</i>
              <h4>Excellence</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>Delivering the highest standards of medical care and expertise.</p>
            </div>
            <div className="value-card">
              <i>🤝</i>
              <h4>Integrity</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>Upholding honesty, transparency, and medical ethics in all actions.</p>
            </div>
            <div className="value-card">
              <i>🚀</i>
              <h4>Innovation</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>Continuously adopting new technologies and advanced treatments.</p>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="container">
        <div className="stats-container">
          <div className="stat-item">
            <h2>15+</h2>
            <p>Years of Experience</p>
          </div>
          <div className="stat-item">
            <h2>50+</h2>
            <p>Expert Doctors</p>
          </div>
          <div className="stat-item">
            <h2>20k+</h2>
            <p>Happy Patients</p>
          </div>
          <div className="stat-item">
            <h2>10+</h2>
            <p>Specialties</p>
          </div>
        </div>
      </div>
    </div>
  );
}