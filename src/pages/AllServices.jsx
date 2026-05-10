import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/services.css';

export default function AllServices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dữ liệu 18 dịch vụ đầy đủ
  const allPackages = [
    { 
      id: 1, category: "Vaccination", title: "Measles Vaccination", hospital: "Vung Tau General Hospital", price: "2,705,000 VND", 
      description: "This package provides a safe and effective measles vaccine to protect your immune system against the measles virus.", rating: 4.8, img: "/assets/img/vac1.jpg" 
    },
    { 
      id: 2, category: "General Health", title: "Basic Health Checkup (Men)", hospital: "DYM Medical Center", price: "4,410,000 VND", 
      description: "A comprehensive basic health screening tailored for men. Includes detailed blood tests, liver and kidney evaluation.", rating: 4.9, img: "/assets/img/hero-1.jpg" 
    },
    { 
      id: 3, category: "Medical Tests", title: "Nasopharyngeal Cancer Screening", hospital: "DYM Medical Center", price: "1,100,000 VND", 
      description: "Early detection of nasopharyngeal cancer through advanced endoscopy and specialized screening tests.", rating: 4.5, img: "/assets/img/vac2.jpg" 
    },
    { 
      id: 4, category: "Medical Tests", title: "Liver Cancer Screening", hospital: "White-Clinic Central", price: "2,607,000 VND", 
      description: "Detailed liver function evaluation including the AFP tumor marker test and liver ultrasound.", rating: 4.7, img: "/assets/img/hero-2.jpg" 
    },
    { 
      id: 5, category: "Vaccination", title: "HPV Vaccine Package (Dose 1)", hospital: "Saigon Maternity", price: "7,300,000 VND", 
      description: "The first dose of the premium HPV vaccine to prevent cervical cancer and other HPV-related diseases.", rating: 4.6, img: "/assets/img/vac1.jpg" 
    },
    { 
      id: 6, category: "General Health", title: "Comprehensive Blood Test", hospital: "Diagnostic Lab Center", price: "850,000 VND", 
      description: "A full panel blood test covering complete blood count (CBC), lipid profile, and blood sugar levels.", rating: 4.4, img: "/assets/img/hero-1.jpg" 
    },
    { 
      id: 7, category: "Vaccination", title: "Hepatitis B Vaccine", hospital: "Community Health Center", price: "450,000 VND", 
      description: "Prevent Hepatitis B infection which can lead to chronic liver disease. Safe for all age groups.", rating: 4.9, img: "/assets/img/vac2.jpg" 
    },
    { 
      id: 8, category: "General Health", title: "Premium Women's Health Check", hospital: "International Hospital", price: "5,200,000 VND", 
      description: "Full body screening designed specifically for women, including breast and pelvic ultrasound.", rating: 4.8, img: "/assets/img/hero-2.jpg" 
    },
    { 
      id: 9, category: "Medical Tests", title: "Diabetes Risk Screening", hospital: "White-Clinic Central", price: "650,000 VND", 
      description: "Includes fasting blood sugar and HbA1c tests to evaluate your risk of developing diabetes.", rating: 4.5, img: "/assets/img/hero-1.jpg" 
    },
    { 
      id: 10, category: "General Health", title: "Cardiovascular Screening", hospital: "Heart Institute HCM", price: "3,500,000 VND", 
      description: "Comprehensive heart evaluation including ECG, Echocardiogram, and lipid profile.", rating: 4.7, img: "/assets/img/hero-2.jpg" 
    },
    { 
      id: 11, category: "Vaccination", title: "Flu Vaccine (Vaxigrip Tetra)", hospital: "Vung Tau General Hospital", price: "350,000 VND", 
      description: "Annual influenza vaccination protecting against 4 common strains of the flu virus.", rating: 4.6, img: "/assets/img/vac1.jpg" 
    },
    { 
      id: 12, category: "Medical Tests", title: "Thyroid Function Test", hospital: "Diagnostic Lab Center", price: "750,000 VND", 
      description: "Measures TSH, T3, and T4 levels to check for hyperthyroidism or hypothyroidism.", rating: 4.4, img: "/assets/img/vac2.jpg" 
    },
    { 
      id: 13, category: "Medical Tests", title: "Kidney Function Test", hospital: "Medic Center HCM", price: "400,000 VND", 
      description: "Assessment of creatinine and BUN levels to check kidney filtration.", rating: 4.4, img: "/assets/img/vac1.jpg" 
    },
    { 
      id: 14, category: "Medical Tests", title: "COVID-19 PCR Testing", hospital: "Community Health Center", price: "450,000 VND", 
      description: "Accurate PCR testing for international travel or medical clearance.", rating: 4.3, img: "/assets/img/vac1.jpg" 
    },
    { 
      id: 15, category: "General Health", title: "Pre-marital Health Check", hospital: "Saigon Maternity", price: "4,000,000 VND", 
      description: "Health screening for couples planning for a healthy future family.", rating: 4.6, img: "/assets/img/hero-2.jpg" 
    },
    { 
      id: 16, category: "General Health", title: "Cancer Screening (Women)", hospital: "Cho Ray Hospital", price: "3,800,000 VND", 
      description: "Comprehensive female cancer screening including breast and cervical tests.", rating: 4.8, img: "/assets/img/hero-2.jpg" 
    },
    { 
      id: 17, category: "Vaccination", title: "Infants Vaccine (6-24w)", hospital: "Hoan My Thu Duc", price: "10,200,000 VND", 
      description: "Comprehensive vaccine package for infants from 6 to 24 weeks old.", rating: 4.7, img: "/assets/img/vac2.jpg" 
    },
    { 
      id: 18, category: "Vaccination", title: "Cervical Cancer & HPV", hospital: "Vung Tau General Hospital", price: "Pay at facility", 
      description: "Prevention against cervical cancer and HPV-related diseases.", rating: 4.9, img: "/assets/img/vac2.jpg" 
    }
  ];

  const filtered = allPackages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const [selectedService, setSelectedService] = useState(allPackages[0]);

  useEffect(() => {
    if (currentItems.length > 0) {
      setSelectedService(currentItems[0]);
    }
  }, [currentPage, searchTerm]);

  return (
    <div className="all-services-page" style={{ backgroundColor: '#e9f2fd', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => navigate('/services')}>
            <span>←</span> Back to Services
          </button>

          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); 
            }}
            style={{ width: '350px', padding: '12px 20px', borderRadius: '50px', border: '1px solid #ddd', outline: 'none' }}
          />
        </div>

        <div className="all-services-split">
          
          {/* CỘT TRÁI: DANH SÁCH 6 GÓI */}
          <div className="services-list-col">
            {currentItems.map(pkg => (
              <div 
                key={pkg.id} 
                className={`service-list-card ${selectedService.id === pkg.id ? 'active' : ''}`}
                onClick={() => setSelectedService(pkg)} 
              >
                {/* DÙNG CHUNG 1 ẢNH T1.JPG CHO BÊN TRÁI */}
                <img src="/assets/img/t1.jpg" alt={pkg.title} className="service-list-img" />
                
                <div className="service-list-info">
                  <h3 className="service-list-title">{pkg.title}</h3>
                  <p className="service-list-hospital">
                    <i className="fas fa-hospital" style={{ color: '#888', marginRight: '5px' }}></i> 
                    {pkg.hospital} <i className="fas fa-check-circle" style={{ color: '#00bfff', fontSize: '12px' }}></i>
                  </p>
                  <p className="service-list-price">Price: {pkg.price}</p>
                </div>
                
                <div className="service-list-action">
                  <button className="btn-book-cyan" style={{ padding: '10px 20px', borderRadius: '50px' }} onClick={() => navigate('/booking')}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className={`page-node ${currentPage === 1 ? 'disabled' : ''}`} 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <span style={{ color: '#a0aab5' }}>{'<'}</span>
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button 
                    key={index + 1} 
                    className={`page-node ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  className={`page-node ${currentPage === totalPages ? 'disabled' : ''}`} 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <span style={{ color: '#a0aab5' }}>{'>'}</span>
                </button>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: CHI TIẾT (HIỂN THỊ ẢNH RIÊNG) */}
          <div className="service-detail-col">
            <div className="service-detail-card">
              {/* CHI TIẾT BÊN PHẢI VẪN HIỂN THỊ ẢNH RIÊNG THEO GÓI */}
              <img src={selectedService.img} alt={selectedService.title} className="service-detail-image" />
              
              <h2 className="service-detail-title">{selectedService.title}</h2>
              <p style={{ fontSize: '15px', color: '#333', fontWeight: 'bold' }}>
                {selectedService.hospital} <i className="fas fa-check-circle" style={{ color: '#00bfff', fontSize: '13px' }}></i>
              </p>
              
              <div style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#f9fbfd', padding: '15px', borderRadius: '10px', border: '1px solid #eef2f6' }}>
                <h4 style={{ color: '#0b3b60', fontSize: '15px', marginBottom: '8px' }}>Service Description:</h4>
                <p className="service-detail-address" style={{ color: '#555' }}>
                  {selectedService.description}
                </p>
              </div>
              
              <div className="service-rating">
                <span>({selectedService.rating})</span>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
            </div>

            <div className="app-download-card">
              <h4>Download app for quick booking</h4>
              <div className="app-download-btns">
                <img src="/assets/img/Appstore.svg" alt="App Store" />
                <img src="/assets/img/Googleplay.svg" alt="Google Play" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}