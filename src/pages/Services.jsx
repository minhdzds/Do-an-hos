import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/services.css';

export default function Services() {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Vaccination');
  
  // Ref dùng để điều khiển thanh trượt
  const sliderRef = useRef(null);

  const toggleAccordion = (id) => setActiveAccordion(activeAccordion === id ? null : id);

  // Hàm trượt sang trái / phải
  const slideLeft = () => {
    sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' }); // Trượt lùi 320px
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' }); // Trượt tiến 320px
  };

  // Mảng chứa 18 gói khám (Mỗi loại 6 gói)
  const allPackages = [
    // --- VACCINATION (6 Gói) ---
    { id: 1, category: "Vaccination", title: "Measles Vaccination", hospital: "Vung Tau General", price: "Pay at facility", img: "/assets/img/vac1.jpg" },
    { id: 2, category: "Vaccination", title: "Cervical Cancer & HPV", hospital: "Vung Tau General", price: "Pay at facility", img: "/assets/img/vac2.jpg" },
    { id: 3, category: "Vaccination", title: "HPV Vaccine (Dose 1)", hospital: "Saigon Maternity", price: "7,300,000 VND", img: "/assets/img/vac1.jpg" },
    { id: 4, category: "Vaccination", title: "Infants Vaccine (6-24w)", hospital: "Hoan My Thu Duc", price: "10,200,000 VND", img: "/assets/img/vac2.jpg" },
    { id: 5, category: "Vaccination", title: "Flu Vaccine (Vaxigrip Tetra)", hospital: "White-Clinic Central", price: "350,000 VND", img: "/assets/img/vac1.jpg" },
    { id: 6, category: "Vaccination", title: "Hepatitis B Vaccination", hospital: "Community Health", price: "150,000 VND", img: "/assets/img/vac2.jpg" },

    // --- GENERAL HEALTH (6 Gói) ---
    { id: 7, category: "General Health", title: "Basic Health Checkup", hospital: "White-Clinic Central", price: "1,500,000 VND", img: "/assets/img/hero-1.jpg" },
    { id: 8, category: "General Health", title: "Premium Wellness Screen", hospital: "International Hospital", price: "5,200,000 VND", img: "/assets/img/hero-2.jpg" },
    { id: 9, category: "General Health", title: "Cancer Screening (Men)", hospital: "Cho Ray Hospital", price: "3,100,000 VND", img: "/assets/img/hero-1.jpg" },
    { id: 10, category: "General Health", title: "Cancer Screening (Women)", hospital: "Cho Ray Hospital", price: "3,800,000 VND", img: "/assets/img/hero-2.jpg" },
    { id: 11, category: "General Health", title: "Cardiovascular Checkup", hospital: "Heart Institute HCM", price: "2,500,000 VND", img: "/assets/img/hero-1.jpg" },
    { id: 12, category: "General Health", title: "Pre-marital Health Check", hospital: "Saigon Maternity", price: "4,000,000 VND", img: "/assets/img/hero-2.jpg" },

    // --- MEDICAL TESTS (6 Gói) ---
    { id: 13, category: "Medical Tests", title: "Comprehensive Blood Test", hospital: "Diagnostic Lab Center", price: "850,000 VND", img: "/assets/img/vac2.jpg" },
    { id: 14, category: "Medical Tests", title: "COVID-19 PCR Testing", hospital: "Community Health Center", price: "450,000 VND", img: "/assets/img/vac1.jpg" },
    { id: 15, category: "Medical Tests", title: "Diabetes Screening Test", hospital: "White-Clinic Central", price: "300,000 VND", img: "/assets/img/vac2.jpg" },
    { id: 16, category: "Medical Tests", title: "Liver Function Test Panel", hospital: "Medic Center HCM", price: "600,000 VND", img: "/assets/img/vac1.jpg" },
    { id: 17, category: "Medical Tests", title: "Thyroid Profile (T3, T4, TSH)", hospital: "Diagnostic Lab Center", price: "550,000 VND", img: "/assets/img/vac2.jpg" },
    { id: 18, category: "Medical Tests", title: "Kidney Function Test", hospital: "Medic Center HCM", price: "400,000 VND", img: "/assets/img/vac1.jpg" }
  ];

  const filteredPackages = allPackages.filter(pkg => pkg.category === selectedCategory);

  return (
    <div className="services-page">
      <div className="service-intro">
        <div className="container">
          <h1>Comprehensive Healthcare Ecosystem</h1>
          <p>Book appointments, medical tests, and vaccinations quickly and conveniently on our platform.</p>
        </div>
      </div>

      <div className="container">
        
        {/* APP OVERLAP BANNER */}
        <div className="app-overlap-container">
          <div className="app-blue-box">
            <div className="app-phone-col">
              <img src="/assets/img/Rectangle.png" alt="Medpro App" />
            </div>
            <div className="app-text-col">
              <h2 style={{ color: '#fff' }}>Take back your smile <br/> with our app</h2>
              <p style={{ color: '#fff' }}>
                If you’re looking for the best healthcare experience, our mobile app might be the perfect solution.
              </p>
              <div className="app-store-btns">
                <img src="/assets/img/Googleplay.svg" alt="Google Play" />
                <img src="/assets/img/Appstore.svg" alt="App Store" />
              </div>
            </div>
          </div>
        </div>

        {/* HEALTHCARE PACKAGES */}
        <h2 className="section-title">Healthcare Services</h2>
        
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
          {['General Health', 'Medical Tests', 'Vaccination'].map(cat => (
            <span 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{ 
                cursor: 'pointer', padding: '10px 25px', borderRadius: '20px', fontWeight: 'bold', transition: 'all 0.3s ease',
                backgroundColor: selectedCategory === cat ? '#00bfff' : 'transparent',
                color: selectedCategory === cat ? 'white' : '#888',
                border: selectedCategory === cat ? 'none' : '1px solid #ddd'
              }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* VÙNG CHỨA SLIDER (CAROUSEL) CÓ 2 MŨI TÊN */}
        <div className="slider-wrapper">
          {/* Nút Mũi Tên Trái */}
          <button className="slider-btn left" onClick={slideLeft}>
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Danh sách gói khám có ref để cuộn */}
          <div className="package-grid" ref={sliderRef}>
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="package-card">
                <img src={pkg.img} alt={pkg.title} className="package-img" />
                <div className="package-content">
                  <h3 className="package-title">{pkg.title}</h3>
                  <p className="package-hospital"><i className="fas fa-hospital" style={{ color: '#00bfff' }}></i> {pkg.hospital}</p>
                  <p className="package-price"><i className="fas fa-tag"></i> {pkg.price}</p>
                  <button className="btn-book-cyan" onClick={() => navigate('/booking')}>Book Now</button>
                </div>
              </div>
            ))}
          </div>

          {/* Nút Mũi Tên Phải */}
          <button className="slider-btn right" onClick={slideRight}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
  <span 
    onClick={() => navigate('/all-services')} 
    style={{ color: '#00bfff', fontSize: '18px', cursor: 'pointer', fontWeight: '500' }}
  >
    View All &raquo;
  </span>
</div>

        {/* OUTSTANDING FEATURES (Giữ nguyên) */}
        <div className="features-container">
          <div className="features-img-col">
            <img src="/assets/img/hero-2.jpg" alt="Our Services" style={{ borderRadius: '20px' }} />
          </div>

          <div className="features-accordion-col">
            <h2>Why Choose Our Services?</h2>
            {[
              { id: 1, title: "Reputable Medical Network", content: "Connect with over 300 leading medical facilities including top-tier hospitals." },
              { id: 2, title: "Professional Consultations", content: "Access online video consultations with experienced specialists." },
              { id: 3, title: "Convenient Home Care", content: "Save time with home visits and digital medical results." },
              { id: 4, title: "Privacy & Security", content: "Your data is protected by the highest international security standards." }
            ].map(item => (
              <div key={item.id} className={`accordion-item ${activeAccordion === item.id ? 'active' : ''}`}>
                <div className="accordion-header" onClick={() => toggleAccordion(item.id)}>
                  <div className="accordion-num">{item.id}</div>
                  <div className="accordion-title">{item.title}</div>
                  <div className="accordion-icon"><i className="fas fa-chevron-down"></i></div>
                </div>
                <div className="accordion-content">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}