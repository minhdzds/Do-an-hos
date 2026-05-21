// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    setUser(loggedInUser);

    // 2. Tải lịch sử khám bệnh từ Backend
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/patient/${loggedInUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error("Lỗi tải lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  // Hàm HỦY LỊCH dành cho bệnh nhân
  const handleCancel = async (appId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        alert("Đã hủy lịch hẹn thành công.");
        // Cập nhật lại UI lập tức
        setAppointments(prev => prev.map(app => app.id === appId ? { ...app, status: 'cancelled' } : app));
      } else {
        alert("Có lỗi xảy ra khi hủy lịch.");
      }
    } catch (err) {
      alert("Lỗi kết nối đến máy chủ.");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
        <div className="profile-sidebar">
          <div className="user-avatar-large">{user.full_name.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h3>{user.full_name}</h3>
            <p>Thành viên hệ thống</p>
          </div>
          <div style={{ marginTop: '20px' }}>
            <div className="profile-details-item">
              <i className="fas fa-envelope"></i> {user.email}
            </div>
            <div className="profile-details-item">
              <i className="fas fa-phone-alt"></i> {user.phone || 'Chưa cập nhật số điện thoại'}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH LỊCH SỬ KHÁM BỆNH */}
        <div className="profile-content">
          <h2 className="history-title">
            <i className="fas fa-notes-medical" style={{color: '#3182ce', marginRight: '10px'}}></i>
            Lịch sử khám bệnh
          </h2>
          
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <i className="fas fa-calendar-times" style={{fontSize: '40px', color: '#cbd5e0', marginBottom: '15px'}}></i>
              <p>Bạn chưa có lịch hẹn nào trong hệ thống.</p>
            </div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="history-card">
                
                <div className="history-header">
                  {/* Sử dụng chung class badge của admin.css hoặc tự viết thêm */}
                  <span className={`badge badge-${app.status}`}>
                    {app.status.toUpperCase()}
                  </span>
                  
                  {/* Nút Hủy chỉ hiện khi lịch đang PENDING (chờ phân công) */}
                  {app.status === 'pending' && (
                    <button className="btn-cancel-app" onClick={() => handleCancel(app.id)}>
                      <i className="fas fa-times"></i> Hủy lịch
                    </button>
                  )}
                </div>
                
                <div className="history-body">
                  <div><strong>Ngày khám:</strong> {new Date(app.appointment_date).toLocaleDateString('vi-VN')}</div>
                  <div><strong>Giờ khám:</strong> <span style={{ color: '#3182ce', fontWeight: 'bold' }}>{app.start_time}</span></div>
                  <div><strong>Chuyên khoa:</strong> {app.specialty}</div>
                  <div><strong>Bác sĩ:</strong> <span style={{color: '#2b6cb0', fontWeight: '600'}}>{app.doctor_name ? `BS. ${app.doctor_name}` : 'Chờ phân công'}</span></div>
                </div>

                {/* KHUNG KẾT LUẬN CỦA BÁC SĨ (Chỉ hiện khi ca khám đã hoàn thành và có ghi chú) */}
                {app.status === 'completed' && app.doctor_notes && (
                  <div className="history-notes">
                    <div className="history-notes-title">
                      <i className="fas fa-stethoscope"></i> Bác sĩ kết luận / Hướng dẫn:
                    </div>
                    <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {app.doctor_notes}
                    </p>
                  </div>
                )}
                
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}