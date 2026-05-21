// src/pages/BookingConfirmation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/css/bookingConfirmation.css'; 

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Lấy dữ liệu từ trang đặt lịch
  const bookingSummary = location.state;

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [notes, setNotes] = useState('');
  
  // 1. Quản lý trạng thái nhập SĐT và Báo lỗi
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    if (!bookingSummary || !user) {
      alert("Please select appointment details first!");
      navigate('/booking');
    } else {
      // Gán SĐT mặc định của user nếu có
      setPhone(user.phone || '');
    }
  }, [bookingSummary, user, navigate]);

  const handleFinalConfirm = async () => {
    if (!user || !bookingSummary) return;

    // 2. LOGIC KIỂM TRA SĐT (Bật đèn đỏ nếu trống)
    if (!phone || phone.trim() === '') {
      setPhoneError(true);
      return; // Cắt ngang, không cho API chạy
    }

    setLoading(true);
    setPhoneError(false);

    const completeBookingData = {
      patient_id: user.id,
      specialty: bookingSummary.specialty,
      appointment_date: bookingSummary.appointment_date,
      start_time: bookingSummary.start_time,
      notes: notes
    };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeBookingData)
      });

      if (response.ok) {
        // Cập nhật SĐT mới vào localStorage
        const updatedUser = { ...user, phone: phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert("🎉 Appointment booked successfully! Please wait for our confirmation.");
        navigate('/profile'); 
      } else {
        const data = await response.json();
        alert("Booking failed: " + data.error);
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("System busy, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !bookingSummary) return null; 

  return (
    <div className="confirm-page">
      <div className="confirm-container">
        
        {/* CỘT TRÁI: THÔNG TIN VÀ LÝ DO KHÁM */}
        <div className="confirm-left-col">
          <h2 className="confirm-title-main">Patient Information</h2>

          <div className="form-group">
            <label className="form-label"><i className="fas fa-user"></i> Full Name</label>
            <input type="text" className="form-input" value={user.full_name} disabled />
          </div>

          <div className="form-group">
            <label className="form-label"><i className="fas fa-envelope"></i> Email Address</label>
            <input type="email" className="form-input" value={user.email} disabled />
          </div>

          {/* Ô SỐ ĐIỆN THOẠI CÓ THỂ CHỈNH SỬA & BÁO ĐỎ KHI LỖI */}
          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-phone-alt"></i> Contact Phone Number <span style={{color: '#e53e3e'}}>*</span>
            </label>
            <input 
              type="text" 
              className={`form-input ${phoneError ? 'input-error' : ''}`}
              placeholder="Enter your phone number for contact..." 
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                // Ẩn cảnh báo đỏ ngay khi khách hàng bắt đầu gõ phím
                if (e.target.value.trim() !== '') setPhoneError(false); 
              }}
            />
            {/* Dòng chữ cảnh báo đỏ */}
            {phoneError && (
              <span className="error-msg">
                <i className="fas fa-exclamation-circle"></i> Please provide a valid phone number to complete booking!
              </span>
            )}
          </div>

          <div className="form-group" style={{marginTop: '30px'}}>
            <label className="form-label"><i className="fas fa-comment-medical"></i> Reason for Visit / Notes (Optional)</label>
            <textarea 
              className="form-input notes-textarea"
              placeholder="Describe your symptoms or requirements (e.g. Toothache, Regular checkup)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* CỘT PHẢI: TỔNG HỢP LỊCH KHÁM (SUMMARY CARD) */}
        {/* Thay thế phần hiển thị CỘT PHẢI: TỔNG HỢP LỊCH KHÁM */}
<div className="confirm-right-col">
  <div className="summary-card-header">
    <i className="fas fa-clipboard-list" style={{fontSize: '24px'}}></i>
    <h3>Appointment Summary</h3>
  </div>

  {/* 1. Thay thế icon Chuyên khoa */}
  <div className="summary-item-wrapper">
    <div className="summary-icon-box">
      <img src="/assets/img/Orion_first-aid-kit.svg" alt="Department" className="summary-svg-icon" />
    </div>
    <div className="summary-text-box">
      <div className="sub-label">Department</div>
      <div className="main-value">{bookingSummary.specialty}</div>
    </div>
  </div>

  {/* 2. Thay thế icon Phòng khám */}
  <div className="summary-item-wrapper">
    <div className="summary-icon-box">
      <img src="/assets/img/Orion_find-user.svg" alt="Clinic" className="summary-svg-icon" />
    </div>
    <div className="summary-text-box">
      <div className="sub-label">Clinic / Area</div>
      <div className="main-value">{bookingSummary.clinic_name}</div>
    </div>
  </div>

  {/* 3. Thay thế icon Thời gian */}
  <div className="summary-item-wrapper">
    <div className="summary-icon-box">
      <img src="/assets/img/Orion_search.svg" alt="Time" className="summary-svg-icon" />
    </div>
    <div className="summary-text-box">
      <div className="sub-label">Scheduled Time</div>
      <div className="main-value">
        {bookingSummary.start_time} - {new Date(bookingSummary.appointment_date).toLocaleDateString('en-GB')}
      </div>
    </div>
  </div>

  {/* VÙNG NÚT HÀNH ĐỘNG GIỮ NGUYÊN... */}
  <div className="confirm-action-group">
    <button className="btn-back-outline" onClick={() => navigate('/booking')}>Back</button>
    <button className="btn-confirm-primary" onClick={handleFinalConfirm} disabled={loading}>
      {loading ? "Processing..." : "Confirm & Book"}
    </button>
  </div>
</div>
      </div>
    </div>
  );
}