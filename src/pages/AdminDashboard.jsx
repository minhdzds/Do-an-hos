import { useState, useEffect } from 'react';
import '../assets/css/admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API lấy danh sách người dùng và lịch hẹn
        const [resUsers, resApps] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users'),
          fetch('http://localhost:5000/api/admin/all-appointments')
        ]);
        
        setUsers(await resUsers.json());
        setAppointments(await resApps.json());
      } catch (err) {
        console.error("Lỗi tải dữ liệu hệ thống:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar quản trị */}
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
            <i className="icon-user"></i> Quản lý Người dùng
          </button>
          <button 
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="icon-calendar"></i> Quản lý Lịch hẹn
          </button>
        </nav>
      </aside>

      {/* Nội dung chính */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{activeTab === 'users' ? 'Danh sách người dùng' : 'Tất cả lịch hẹn'}</h1>
          <div className="admin-stats">
            <span>Tổng cộng: {activeTab === 'users' ? users.length : appointments.length}</span>
          </div>
        </header>

        <div className="admin-card">
          {loading ? (
            <div className="loader">Đang tải dữ liệu...</div>
          ) : activeTab === 'users' ? (
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
                      <td>
                        <span className={`badge badge-${user.role}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Bệnh nhân</th>
                    <th>Bác sĩ</th>
                    <th>Giờ khám</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td>{new Date(app.appointment_date).toLocaleDateString()}</td>
                      <td>{app.patient_name}</td>
                      <td>BS. {app.doctor_name}</td>
                      <td>{app.start_time}</td>
                      <td>
                        <span className={`badge badge-${app.status}`}>
                          {app.status}
                        </span>
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