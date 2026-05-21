import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/admin.css'; 

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('schedule'); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'doctor') {
      alert("Access Denied: This area is for Doctors only.");
      navigate('/login');
      return;
    }
    setDoctorInfo(loggedInUser);

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/doctor/${loggedInUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error("Failed to load schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [navigate]);

  // HÀM MỚI BẠN VỪA THÊM: Xử lý khi bác sĩ khám xong và ghi chú
  const handleComplete = async (appointmentId) => {
    // Cho phép bác sĩ gõ kết quả/đơn thuốc
    const docNotes = window.prompt("Nhập kết luận khám bệnh / Đơn thuốc cho bệnh nhân này:");
    if (docNotes === null) return; // Nếu ấn Cancel thì hủy thao tác

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', doctor_notes: docNotes }),
      });

      if (response.ok) {
        setAppointments(prev => prev.map(app => app.id === appointmentId ? { ...app, status: 'completed' } : app));
        alert("Đã lưu kết quả khám thành công!");
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  // Hàm HỦY/TỪ CHỐI lịch (Dùng cho nút Từ chối nếu bác sĩ bận)
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    if (!window.confirm(`Mark this appointment as ${newStatus}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments(prev => 
          prev.map(app => app.id === appointmentId ? { ...app, status: newStatus } : app)
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (!doctorInfo) return null;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/assets/img/logo.svg" alt="Logo" className="admin-logo" />
          <h2>Doctor Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <i className="fas fa-calendar-alt"></i> My Schedule
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user-md"></i> My Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{activeTab === 'schedule' ? 'Daily Examination Schedule' : 'Professional Profile'}</h1>
          <div className="admin-stats">
            <span>Total Tasks: {appointments.length}</span>
          </div>
        </header>

        <div className="admin-card">
          {loading ? (
            <div className="loader">Updating records...</div>
          ) : activeTab === 'schedule' ? (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient Name</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td>{new Date(app.appointment_date).toLocaleDateString('en-GB')}</td>
                      <td className="font-bold" style={{ color: '#007bff' }}>{app.start_time}</td>
                      <td className="font-bold">{app.patient_name}</td>
                      <td>{app.patient_phone || 'N/A'}</td>
                      <td>
                        <span className={`badge badge-${app.status}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {/* HIỂN THỊ NÚT BẤM CHO BÁC SĨ TẠI ĐÂY */}
                        {app.status === 'confirmed' && (
                          <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Nút Hoàn thành khám */}
                            <button 
                              className="btn-confirm"
                              onClick={() => handleComplete(app.id)} // Đã sửa thành gọi hàm mới
                              style={{ 
                                backgroundColor: '#22c55e', color: '#fff', border: 'none', 
                                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' 
                              }}
                            >
                              Done
                            </button>
                            
                            {/* Nút Từ chối / Hủy ca */}
                            <button 
                              onClick={() => handleUpdateStatus(app.id, 'cancelled')} 
                              style={{ 
                                backgroundColor: '#e53e3e', color: '#fff', border: 'none', 
                                padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' 
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              <h3>Dr. {doctorInfo.full_name}</h3>
              <p>Email: {doctorInfo.email}</p>
              <p>Role: {doctorInfo.role.toUpperCase()}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}