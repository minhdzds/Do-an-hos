import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/css/doctors.css';

export default function DoctorDetail() {
  const { id } = useParams(); // Get doctor ID from URL
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [similarDoctors, setSimilarDoctors] = useState([]); // State cho bác sĩ cùng chuyên khoa
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi chuyển sang bác sĩ khác
    window.scrollTo(0, 0); 
    
    const fetchDoctorDetail = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin bác sĩ hiện tại
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`);
        if (!response.ok) throw new Error('Doctor not found');
        const data = await response.json();
        setDoctor(data);

        // 2. Lấy danh sách tất cả bác sĩ để tìm người cùng chuyên khoa
        const allDocsResponse = await fetch(`http://localhost:5000/api/doctors`);
        if (allDocsResponse.ok) {
          const allDocs = await allDocsResponse.json();
          // Lọc bác sĩ có cùng specialty và khác ID hiện tại
          const similar = allDocs.filter(d => 
            d.specialty === data.specialty && String(d.id) !== String(id)
          ).slice(0, 4); // Chỉ lấy tối đa 4 bác sĩ
          setSimilarDoctors(similar);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetail();
  }, [id]); // Dependency là [id], để khi click vào bác sĩ cùng chuyên khoa, trang sẽ tự động tải lại data mới

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.6rem'}}>Loading information...</div>;
  if (!doctor) return <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.6rem'}}>Doctor information not found!</div>;

  return (
    <div className="doc-detail-page">
      <div className="container">
        {/* Nút quay lại */}
        <button className="back-btn" onClick={() => navigate('/doctors')} style={{ marginBottom: '20px' }}>
          <i className="fas fa-arrow-left"></i> Back to list
        </button>

        <div className="doc-detail-layout">
          {/* Cột 1: Thông tin (Trái) */}
          <div className="doc-detail-info">
            <h1 className="doc-name">{doctor.full_name}</h1>
            <p className="doc-title-specialty">
              {doctor.title} - Specialty: <span className="highlight-text">{doctor.specialty}</span>
            </p>
            
            <div className="doc-contact-block">
              <strong>Email:</strong> {doctor.email} <br/>
              <strong>Position:</strong> {doctor.position || 'Shine Heart Clinic'} <br/>
            </div>

            <div className="doc-bio-section">
              <h3 className="section-title">Biography</h3>
              <p className="doc-bio-text">
                {doctor.bio || 'The doctor has not updated their detailed biography and professional experience yet.'}
              </p>
            </div>

            {/* Nút Đặt Lịch */}
            <div className="doc-action-block">
              <button className="book-btn doc-detail-book" onClick={() => navigate('/booking')}>
                BOOK APPOINTMENT NOW
              </button>
            </div>
          </div>

          {/* Cột 2: Ảnh (Phải) */}
          <div className="doc-detail-image-container">
            <img 
              src={doctor.avatar_url || '/assets/img/default-doctor.png'} 
              alt={doctor.full_name} 
              className="doc-detail-photo"
            />
          </div>
        </div>

        {/* ========== PHẦN BÁC SĨ CÙNG CHUYÊN KHOA ========== */}
        {similarDoctors.length > 0 && (
          <div className="similar-doctors-section">
            <h2 className="similar-title">Similar Specialists</h2>
            <div className="similar-doctors-grid">
              {similarDoctors.map(doc => (
                <div 
                  key={doc.id} 
                  className="doctor-card" 
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                >
                  <div className="doctor-img-container">
                    <img src={doc.avatar_url || '/assets/img/default-doctor.png'} alt={doc.full_name} />
                  </div>
                  <div className="doc-info">
                    <h4>{doc.full_name}</h4>
                    <p>{doc.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}