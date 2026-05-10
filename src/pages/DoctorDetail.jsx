import React, { useState, useEffect } from 'react';
import '../assets/css/doctors.css';

export default function Doctors() {
  const [allDoctors, setAllDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); 
  const [selectedDept, setSelectedDept] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Hiện 8 bác sĩ mỗi trang

  // ==========================================
  // 1. FETCH DỮ LIỆU TỪ BACKEND API
  // ==========================================
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/doctors');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllDoctors(data);
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách bác sĩ:", error);
      }
    };

    fetchDoctors();
  }, []);

  // ==========================================
  // 2. TẠO DANH SÁCH KHOA ĐỘNG TỪ API
  // ==========================================
  // Giả sử API của bạn trả về trường 'specialty' hoặc 'department' cho chuyên khoa
  // Dùng Set để lọc ra các khoa không bị trùng lặp
  const departments = ["Tất cả", ...new Set(allDoctors.map(doc => doc.specialty || doc.department).filter(Boolean))];

  // ==========================================
  // 3. LOGIC LỌC VÀ PHÂN TRANG
  // ==========================================
  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const filteredDoctors = allDoctors.filter(doc => {
    const docDept = doc.specialty || doc.department;
    const matchDept = selectedDept === 'Tất cả' || docDept === selectedDept;
    const matchSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="doctors-layout">
          
          {/* =====================================
              SIDEBAR BÊN TRÁI (LỌC THEO KHOA)
          ===================================== */}
          <div className="doctors-sidebar">
            <div className="doc-search-box">
              <input 
                type="text" 
                className="doc-search-input" 
                placeholder="Tìm kiếm bác sĩ..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="doc-search-btn" onClick={handleSearch}>Tìm kiếm</button>
            </div>

            <div className="doc-sidebar-menu">
              <div className="doc-menu-title">
                Khối Lâm sàng - Viện, Trung tâm <i className="fas fa-chevron-down" style={{fontSize: '12px', color: '#008457'}}></i>
              </div>
              <ul className="doc-menu-list">
                {departments.map((dept, index) => (
                  <li 
                    key={index} 
                    className={selectedDept === dept ? 'active' : ''}
                    onClick={() => { setSelectedDept(dept); setCurrentPage(1); }}
                  >
                    {dept}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* =====================================
              MAIN CONTENT BÊN PHẢI (DANH SÁCH)
          ===================================== */}
          <div className="doctors-main">
            
            <div className="doctors-header">
              <h2>Tất cả <span>{filteredDoctors.length}</span> bác sĩ chuyên khoa</h2>
            </div>

            {currentDoctors.length > 0 ? (
              <div className="doctors-grid">
                {currentDoctors.map(doc => (
                  <div key={doc.id || doc._id} className="doc-card">
                    <div className="doc-img-bg">
                      {/* Đảm bảo backend trả về đúng link ảnh ở trường 'image' hoặc 'img' */}
                      <img src={doc.image || doc.img || '/assets/img/default-doctor.png'} alt={doc.name} />
                    </div>
                    <div className="doc-info">
                      <h4>{doc.name}</h4>
                      {/* Nếu có trường chức vụ (role) thì in ra, không thì in chuyên khoa */}
                      <p>{doc.role || doc.specialty || doc.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>Không tìm thấy bác sĩ nào phù hợp.</p>
            )}

            {/* =====================================
                PHÂN TRANG
            ===================================== */}
            {totalPages > 1 && (
              <div className="doc-pagination">
                <button 
                  className={`doc-page-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-arrow-left" style={{fontSize: '12px'}}></i>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button 
                    key={index + 1} 
                    className={`doc-page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  className={`doc-page-btn ${currentPage === totalPages ? 'disabled' : ''}`} 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-arrow-right" style={{fontSize: '12px'}}></i>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}