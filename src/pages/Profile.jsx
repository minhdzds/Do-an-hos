import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    setUser(loggedInUser);

    const fetchHistory = async () => {
      try {
        // Lấy lịch sử theo ID bệnh nhân
        const response = await fetch(`http://localhost:5000/api/appointments/patient/${loggedInUser.id}`);
        if (response.ok) {
          setAppointments(await response.json());
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
        body: JSON.stringify({ status: 'cancelled' }) // Đổi status thành cancelled
      });

      if (response.ok) {
        alert("Đã hủy lịch hẹn thành công.");
        // Cập nhật lại UI lập tức
        setAppointments(prev => prev.map(app => app.id === appId ? { ...app, status: 'cancelled' } : app));
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Cột trái: Thông tin cá nhân */}
        <div className="profile-sidebar">
          <div className="user-avatar-large">{user.full_name.charAt(0)}</div>
          <div className="profile-info">
            <h3>{user.full_name}</h3>
            <p>Bệnh nhân</p>
            <hr style={{ borderColor: '#eef2f6', margin: '15px 0' }} />
            <p><i className="fas fa-envelope"></i> {user.email}</p>
            <p><i className="fas fa-phone"></i> {user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>

        {/* Cột phải: Lịch sử khám bệnh */}
        <div className="profile-content">
          <h2 style={{ color: '#0b3b60', marginBottom: '20px' }}>Lịch sử khám bệnh</h2>
          
          {loading ? <p>Đang tải dữ liệu...</p> : appointments.length === 0 ? (
            <p style={{ color: '#888' }}>Bạn chưa có lịch hẹn nào.</p>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="history-card">
                <div className="history-header">
                  <span className={`badge badge-${app.status}`}>{app.status.toUpperCase()}</span>
                  
                  {/* Nút Hủy chỉ hiện khi lịch đang chờ hoặc đã xác nhận */}
                  {(app.status === 'pending' || app.status === 'confirmed') && (
                    <button className="btn-cancel-app" onClick={() => handleCancel(app.id)}>
                      <i className="fas fa-times-circle"></i> Hủy lịch
                    </button>
                  )}
                </div>
                
                <div className="history-body">
                  <div><strong>Ngày khám:</strong> {new Date(app.appointment_date).toLocaleDateString('vi-VN')}</div>
                  <div><strong>Giờ khám:</strong> <span style={{ color: '#3182ce', fontWeight: 'bold' }}>{app.start_time}</span></div>
                  <div><strong>Chuyên khoa:</strong> {app.specialty}</div>
                  <div><strong>Bác sĩ:</strong> {app.doctor_name ? `BS. ${app.doctor_name}` : 'Chờ phân công'}</div>
                </div>

                {/* Phần kết quả của bác sĩ chỉ hiện khi ca khám đã hoàn thành */}
                {app.status === 'completed' && app.doctor_notes && (
                  <div className="history-notes">
                    <strong><i className="fas fa-user-md"></i> Bác sĩ kết luận:</strong>
                    <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>{app.doctor_notes}</p>
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