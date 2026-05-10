import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/doctors.css';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setFilteredDoctors(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleFilter = (specialty) => {
    setSelectedSpecialty(specialty);
    if (specialty === 'All') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.specialty === specialty));
    }
  };

  const specialties = ['All', 'Gastroenterology', 'Musculoskeletal', 'Pediatrics', 'Cardiology', 'Internal Medicine'];

  return (
    <div className="doctors-page" style={{ padding: '40px 0', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <h2 className="doctors-heading">
          Our Expert Doctors
        </h2>
        <p className="doctors-subheading">
          Dedicated - Professional - For Community Health
        </p>

        
        {/* Filter */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {specialties.map(s => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`filter-btn ${selectedSpecialty === s ? 'active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Doctor Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '30px' 
        }}>
          {filteredDoctors.map(doc => (
  <div 
    key={doc.id} 
    className="doctor-card" 
    onClick={() => navigate(`/doctors/${doc.id}`)} // Bấm vào là chuyển trang
  >
    <div className="doctor-img-container">
      <img 
        src={doc.avatar_url || '/assets/img/doc1.png'} 
        alt={doc.full_name} 
      />
    </div>
    <div style={{ padding: '20px' }}>
      <h4 style={{ color: '#0b3b60', margin: '10px 0' }}>{doc.title} {doc.full_name}</h4>
      <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#3182ce' }}>{doc.position}</p>
      <p style={{ color: '#52c41a', fontSize: '13px', margin: '5px 0' }}>
        <i className="fas fa-stethoscope"></i> {doc.specialty}
      </p>
      <button className="book-btn">View Profile</button>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}
