import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/booking.css';

export default function Booking() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dates, setDates] = useState([]);

  // Hàm tạo khung giờ khác nhau cho các phòng khám
  const generateSlots = (type) => {
    if (type === 'A') {
      return ["07:00", "08:00", "09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30"];
    }
    return ["07:30", "08:30", "09:30", "10:30", "11:30", "14:00", "15:00", "16:00"];
  };

  // Cấu trúc Mapping mới: Mỗi chuyên khoa có một MẢNG các phòng khám
  const roomMapping = {
    "Dermatology": [
      { id: 'der-1', name: "Dermatology Clinic A - Room 605", slots: generateSlots('A') },
      { id: 'der-2', name: "Dermatology Clinic B - Room 606", slots: generateSlots('B') }
    ],
    "Cardiology": [
      { id: 'car-1', name: "Heart Center A - Room 401", slots: generateSlots('A') },
      { id: 'car-2', name: "Heart Center B - Room 402", slots: generateSlots('B') }
    ],
    "Orthopedics": [
      { id: 'ort-1', name: "Orthopedic Unit A - Room 201", slots: generateSlots('A') },
      { id: 'ort-2', name: "Orthopedic Unit B - Room 202", slots: generateSlots('B') }
    ],
    "Gastroenterology": [
      { id: 'gas-1', name: "Digestive Clinic A - Room 305", slots: generateSlots('A') },
      { id: 'gas-2', name: "Digestive Clinic B - Room 306", slots: generateSlots('B') }
    ],
    "Endocrinology": [
      { id: 'end-1', name: "Endocrine Room A - Room 501", slots: generateSlots('A') },
      { id: 'end-2', name: "Endocrine Room B - Room 502", slots: generateSlots('B') }
    ],
    "Respiratory": [
      { id: 'res-1', name: "Respiratory Unit A - Room 108", slots: generateSlots('A') },
      { id: 'res-2', name: "Respiratory Unit B - Room 109", slots: generateSlots('B') }
    ],
    "Default": [
      { id: 'def-1', name: "General Clinic A", slots: ["08:00", "10:00"] },
      { id: 'def-2', name: "General Clinic B", slots: ["09:00", "11:00"] }
    ]
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      alert("Please login to book an appointment!");
      navigate('/login');
      return;
    }
    setUser(JSON.parse(loggedInUser));

    const fetchSpecialties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors');
        const doctors = await response.json();
        const uniqueSpecialties = [...new Set(doctors.map(doc => doc.specialty))].filter(Boolean);
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error("Error fetching specialties:", err);
      }
    };

    const generateDates = () => {
      const dateArray = [];
      const today = new Date();
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dateArray.push({
          display: `${nextDate.getDate()}/${nextDate.getMonth() + 1}`,
          dayName: daysOfWeek[nextDate.getDay()],
          fullDate: nextDate.toISOString().split('T')[0]
        });
      }
      setDates(dateArray);
      setSelectedDate(dateArray[0].fullDate);
    };

    fetchSpecialties();
    generateDates();
  }, [navigate]);

  const handleSubmitBooking = () => {
  if (!selectedSpecialty || !selectedDate || !selectedTime) return;

  // 1. Tự động dò xem khung giờ được chọn (selectedTime) đang nằm ở phòng khám nào
  const currentRooms = roomMapping[selectedSpecialty] || roomMapping["Default"];
  const matchedRoom = currentRooms.find(room => room.slots.includes(selectedTime));
  const clinicName = matchedRoom ? matchedRoom.name : "General Clinic Area";

  // 2. Gom dữ liệu đã chọn thành một gói tạm thời (provisional data)
  const provisionalBookingData = {
    specialty: selectedSpecialty,
    appointment_date: selectedDate,
    start_time: selectedTime,
    clinic_name: clinicName // Truyền tên phòng khám (Ví dụ: Digestive Clinic A - Room 305)
  };

  // 3. Chuyển hướng sang trang xác nhận kèm theo gói dữ liệu trên
  navigate('/booking/confirmation', { state: provisionalBookingData });
};

  // Lấy mảng các phòng khám dựa trên chuyên khoa
  const currentRooms = roomMapping[selectedSpecialty] || roomMapping["Default"];
  const isFormReady = selectedSpecialty !== '' && selectedTime !== '';

  if (!user) return null;

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h2 className="booking-title">Book an Appointment</h2>

        <div className="form-section">
          <label className="section-label">PATIENT INFORMATION</label>
          <div className="patient-info-box">
            <i className="fas fa-user-circle"></i>
            Full Name: {user.full_name}
          </div>
        </div>

        <div className="form-section">
          <label className="section-label">Select Specialty:</label>
          <select 
            className="booking-select-box"
            value={selectedSpecialty}
            onChange={(e) => {
              setSelectedSpecialty(e.target.value);
              setSelectedTime('');
            }}
          >
            <option value="" disabled>-- Choose a department --</option>
            {specialties.map((spec, index) => (
              <option key={index} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="section-label">Appointment Date:</label>
          <div className="date-selector-row">
            {dates.map((dt, index) => (
              <div 
                key={index} 
                className={`date-box ${selectedDate === dt.fullDate ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDate(dt.fullDate);
                  setSelectedTime('');
                }}
              >
                <div className="date-num">{dt.display}</div>
                <div className="date-day">{dt.dayName}</div>
              </div>
            ))}
          </div>
        </div>

        {selectedSpecialty && (
          <div className="form-section">
            <label className="section-label">Available Clinics & Times:</label>
            <div className="room-accordion">
              <div className="room-header main-title">
                {selectedSpecialty} Examination Center
              </div>
              
              {/* Duyệt qua mảng các phòng khám */}
              {currentRooms.map((room) => (
                <div key={room.id} className="room-item" style={{ borderBottom: '1px solid #e1e8f0' }}>
                  <div className="room-header sub-header">
                    <i className="fas fa-door-open"></i> {room.name}
                  </div>
                  <div className="time-slots-grid">
                    {room.slots.map((time, idx) => (
                      <div 
                        key={idx}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="booking-submit-area">
          <button 
            className={`btn-submit-booking ${isFormReady ? 'ready' : ''}`}
            onClick={handleSubmitBooking}
            disabled={!isFormReady}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}