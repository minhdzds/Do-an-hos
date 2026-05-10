export default function Booking() {
  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '60vh' }}>
      <h2 className="section-heading text-center">Đặt lịch khám bệnh</h2>
      <p className="section-desc text-center">Vui lòng điền thông tin của bạn vào form dưới đây.</p>
      
      {/* Khung chứa Form đặt lịch (sẽ code chi tiết sau) */}
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Thông tin cuộc hẹn</h3>
        <p>Form chọn Bác sĩ, Ngày giờ và nhập tên bệnh nhân sẽ nằm ở đây...</p>
        <br />
        <button className="btn btn-primary">Xác nhận đặt lịch</button>
      </div>
    </div>
  );
}