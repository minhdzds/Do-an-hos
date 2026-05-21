import { useState, useEffect } from 'react';
import '../assets/css/admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('appointments'); // Đổi mặc định tab sang lịch hẹn cho tiện test
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]); // State mới lưu danh sách bác sĩ
  const [loading, setLoading] = useState(true);

  // State lưu trữ bác sĩ được chọn cho từng ca khám (key là id lịch hẹn, value là id bác sĩ)
  const [selectedDoctors, setSelectedDoctors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resUsers, resApps, resDocs] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users'),
          fetch('http://localhost:5000/api/admin/all-appointments'),
          fetch('http://localhost:5000/api/doctors') // Gọi thêm API lấy bác sĩ
        ]);
        
        setUsers(await resUsers.json());
        setAppointments(await resApps.json());
        setDoctors(await resDocs.json());
      } catch (err) {
        console.error("Lỗi tải dữ liệu hệ thống:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý khi Admin thay đổi bác sĩ trong Dropdown
  const handleDoctorSelect = (appointmentId, doctorId) => {
    setSelectedDoctors(prev => ({
      ...prev,
      [appointmentId]: doctorId
    }));
  };

  // ==========================================
  // HÀM XÁC NHẬN VÀ PHÂN CÔNG
  // ==========================================
  const handleAssignAndConfirm = async (appointmentId) => {
    const assignedDoctorId = selectedDoctors[appointmentId];

    if (!assignedDoctorId) {
      alert("Vui lòng chọn một Bác sĩ để phân công trước khi Xác nhận!");
      return;
    }

    if (!window.confirm("Xác nhận phân công lịch hẹn này cho bác sĩ đã chọn?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Gửi cả status VÀ doctor_id lên server
        body: JSON.stringify({ status: 'confirmed', doctor_id: assignedDoctorId }), 
      });

      if (response.ok) {
        alert("Đã phân công và xác nhận lịch hẹn thành công!");
        
        // Tìm tên bác sĩ vừa chọn để cập nhật hiển thị ngay lập tức
        const docName = doctors.find(d => d.id === parseInt(assignedDoctorId))?.full_name;

        setAppointments(prevApps => 
          prevApps.map(app => 
            app.id === appointmentId 
              ? { ...app, status: 'confirmed', doctor_id: assignedDoctorId, doctor_name: docName } 
              : app
          )
        );
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + errorData.error);
      }
    } catch (err) {
      console.error("Lỗi khi kết nối server:", err);
      alert("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/assets/img/logo.svg" alt="Logo" className="admin-logo" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Quản lý Người dùng
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="fas fa-calendar-alt"></i> Phân công Lịch hẹn
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{activeTab === 'users' ? 'Danh sách người dùng' : 'Điều phối Lịch khám'}</h1>
          <div className="admin-stats">
            <span>Tổng cộng: {activeTab === 'users' ? users.length : appointments.length}</span>
          </div>
        </header>

        <div className="admin-card">
          {loading ? (
            <div className="loader">Đang tải dữ liệu hệ thống...</div>
          ) : activeTab === 'users' ? (
            // Bảng Users (Giữ nguyên của bạn)
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ và Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td className="font-bold">{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td><span className={`badge badge-${user.role}`}>{user.role.toUpperCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Bảng Appointments Đã Nâng Cấp Tính Năng Phân Công
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Bệnh nhân</th>
                    <th>Chuyên khoa</th>
                    <th>Phân công Bác sĩ</th> {/* Cột mới */}
                    <th>Giờ khám</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td>{new Date(app.appointment_date).toLocaleDateString('en-GB')}</td>
                      <td className="font-bold">{app.patient_name}</td>
                      <td>{app.specialty}</td>
                      
                      {/* Cột Phân công: Hiển thị Select box nếu đang pending, hiện tên BS nếu đã confirm */}
                      <td>
                        {app.status === 'pending' ? (
                          <select 
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
                            value={selectedDoctors[app.id] || ''}
                            onChange={(e) => handleDoctorSelect(app.id, e.target.value)}
                          >
                            <option value="">-- Chọn bác sĩ trực --</option>
                            {/* Chỉ hiển thị các bác sĩ có chuyên khoa khớp với yêu cầu của bệnh nhân */}
                            {doctors.filter(doc => doc.specialty === app.specialty).map(doc => (
                              <option key={doc.id} value={doc.id}>BS. {doc.full_name}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                            {app.doctor_name ? `BS. ${app.doctor_name}` : 'Không xác định'}
                          </span>
                        )}
                      </td>
                      
                      <td>{app.start_time}</td>
                      <td>
                        <span className={`badge badge-${app.status}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {app.status === 'pending' && (
                          <button 
                            onClick={() => handleAssignAndConfirm(app.id)}
                            style={{ 
                              backgroundColor: '#22c55e', color: '#fff', border: 'none', 
                              padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                          >
                            <i className="fas fa-check-circle"></i> Xác nhận
                          </button>
                        )}
                        <button 
  onClick={() => handleUpdateStatus(app.id, 'cancelled')} 
  style={{ backgroundColor: '#e53e3e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}
>
  Từ chối
</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}