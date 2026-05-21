import { useState, useEffect } from 'react';
import '../assets/css/admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); 
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctors, setSelectedDoctors] = useState({});

  // === STATE CHO POPUP SỬA NGƯỜI DÙNG ===
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', role: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resUsers, resApps, resDocs] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users'),
          fetch('http://localhost:5000/api/admin/all-appointments'),
          fetch('http://localhost:5000/api/doctors') 
        ]);
        setUsers(await resUsers.json());
        setAppointments(await resApps.json());
        setDoctors(await resDocs.json());
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ==========================================
  // HÀM: PHÂN CÔNG & TỪ CHỐI LỊCH HẸN (Đã làm trước đó)
  // ==========================================
  const handleDoctorSelect = (appointmentId, doctorId) => {
    setSelectedDoctors(prev => ({ ...prev, [appointmentId]: doctorId }));
  };

  const handleAssignAndConfirm = async (appointmentId) => {
    const assignedDoctorId = selectedDoctors[appointmentId];
    if (!assignedDoctorId) return alert("Vui lòng chọn một Bác sĩ!");
    if (!window.confirm("Xác nhận phân công lịch hẹn này?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', doctor_id: assignedDoctorId }), 
      });
      if (response.ok) {
        const docName = doctors.find(d => d.id === parseInt(assignedDoctorId))?.full_name;
        setAppointments(prevApps => prevApps.map(app => 
          app.id === appointmentId ? { ...app, status: 'confirmed', doctor_id: assignedDoctorId, doctor_name: docName } : app
        ));
        alert("Đã phân công thành công!");
      }
    } catch (err) { alert("Lỗi kết nối."); }
  };

  const handleReject = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn TỪ CHỐI ca khám này không?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (response.ok) {
        setAppointments(prevApps => prevApps.map(app => app.id === appointmentId ? { ...app, status: 'cancelled' } : app));
        alert("Đã từ chối ca khám!");
      }
    } catch (err) { alert("Lỗi kết nối."); }
  };

  // ==========================================
  // HÀM: QUẢN LÝ NGƯỜI DÙNG (MỚI)
  // ==========================================
  
  // 1. Mở popup sửa
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({ full_name: user.full_name, phone: user.phone || '', role: user.role });
  };

  // 2. Lưu thông tin người dùng
  const handleSaveUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (response.ok) {
        const { data } = await response.json();
        // Cập nhật lại UI bảng người dùng
        setUsers(users.map(u => u.id === data.id ? data : u));
        setEditingUser(null); // Đóng popup
        alert("Cập nhật thông tin thành công!");
      } else {
        alert("Lỗi khi cập nhật.");
      }
    } catch (err) { alert("Lỗi kết nối server."); }
  };

  // 3. Xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác!")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert("Đã xóa người dùng thành công!");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (err) { alert("Lỗi kết nối server."); }
  };

  return (
    <div className="admin-layout">
      {/* --- POPUP CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG --- */}
      {editingUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ color: '#007bff', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
              Xem / Sửa Tài Khoản
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email (Không thể sửa)</label>
              <input type="text" value={editingUser.email} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Họ và Tên</label>
              <input type="text" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Số điện thoại</label>
              <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Vai trò (Role)</label>
              <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="patient">Bệnh nhân (Patient)</option>
                <option value="doctor">Bác sĩ (Doctor)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingUser(null)} style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSaveUser} style={{ padding: '8px 15px', borderRadius: '6px', border: 'none', background: '#007bff', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* --- PHẦN GIAO DIỆN CHÍNH (SIDEBAR & HEADER) --- */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/assets/img/logo.svg" alt="Logo" className="admin-logo" />
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <i className="fas fa-users"></i> Quản lý Người dùng
          </button>
          <button className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
            <i className="fas fa-calendar-alt"></i> Phân công Lịch hẹn
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{activeTab === 'users' ? 'Danh sách người dùng' : 'Điều phối Lịch khám'}</h1>
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
                    <th>Thao tác</th> {/* THÊM CỘT THAO TÁC */}
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
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => openEditModal(user)}
                            style={{ background: '#f8f9fa', color: '#007bff', border: '1px solid #007bff', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                          >
                            <i className="fas fa-edit"></i> Xem / Sửa
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            style={{ background: '#f8f9fa', color: '#e53e3e', border: '1px solid #e53e3e', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                          >
                            <i className="fas fa-trash"></i> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Bảng quản lý lịch hẹn (Giữ nguyên không thay đổi)
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Bệnh nhân</th>
                    <th>Chuyên khoa</th>
                    <th>Phân công Bác sĩ</th> 
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
                      <td>
                        {app.status === 'pending' ? (
                          <select 
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc', width: '100%' }}
                            value={selectedDoctors[app.id] || ''}
                            onChange={(e) => handleDoctorSelect(app.id, e.target.value)}
                          >
                            <option value="">-- Chọn bác sĩ --</option>
                            {doctors.filter(doc => doc.specialty === app.specialty).map(doc => (
                              <option key={doc.id} value={doc.id}>BS. {doc.full_name}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ color: app.status === 'cancelled' ? '#e53e3e' : '#007bff', fontWeight: 'bold' }}>
                            {app.doctor_name ? `BS. ${app.doctor_name}` : (app.status === 'cancelled' ? 'Đã hủy' : 'Không xác định')}
                          </span>
                        )}
                      </td>
                      <td>{app.start_time}</td>
                      <td><span className={`badge badge-${app.status}`}>{app.status.toUpperCase()}</span></td>
                      <td>
                        {app.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleAssignAndConfirm(app.id)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                              Xác nhận
                            </button>
                            <button onClick={() => handleReject(app.id)} style={{ backgroundColor: '#e53e3e', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                              Từ chối
                            </button>
                          </div>
                        )}
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