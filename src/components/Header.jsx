import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // 1. Tạo state để quản lý thông tin user
  const [user, setUser] = useState(null);

  // 2. Hàm kiểm tra trạng thái đăng nhập
  const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  // 3. Theo dõi sự thay đổi của URL và storage
  useEffect(() => {
    checkAuth();
    
    // Lắng nghe sự kiện storage (dành cho nhiều tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]); // Mỗi khi chuyển trang (location thay đổi), Header sẽ kiểm tra lại auth

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setUser(null);
    alert("Đã đăng xuất thành công!");
    navigate('/');
  };

  const handleBookingClick = (e) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      navigate('/booking');
    } else {
      alert("Vui lòng đăng nhập để thực hiện đặt lịch khám bệnh!");
      navigate('/login');
    }
  };

  return (
    <header 
      className="header"
      style={!isHome ? { paddingBottom: '20px', minHeight: 'auto' } : {}}
    >
      <div className="container">
        <div className="header-top">
          <Link to="/">
            <img src="/assets/img/logo.svg" alt="shine heart" className="logo" />
          </Link>
          
          <nav className="navbar">
            <ul className="navbar__list">
              <li className="navbar__item">
                <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}>Home</Link>
              </li>
              <li className="navbar__item">
                <Link to="/services" className={`navbar__link ${location.pathname === '/services' ? 'navbar__link--active' : ''}`}>Services</Link>
              </li>
              <li className="navbar__item">
                <Link to="/about" className={`navbar__link ${location.pathname === '/about' ? 'navbar__link--active' : ''}`}>About</Link>
              </li>
              <li className="navbar__item">
                <Link to="/doctors" className={`navbar__link ${location.pathname === '/doctors' ? 'navbar__link--active' : ''}`}>Doctors</Link>
              </li>
            </ul>
          </nav>
          
          <div className="header__action">
            {user ? (
              <div className="header__user-info">
                {/* Nút quay lại trang Quản lý chỉ hiện cho Admin */}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="btn--admin-nav">
                    Admin Panel
                  </Link>
                )}

                {/* Nút dành riêng cho Bác sĩ */}
                {user.role === 'doctor' && (
                  <Link to="/doctor-dashboard" className="btn--admin-nav">
                    Doctor Panel
                  </Link>
                )}

                {/* KHỐI AVATAR TRÒN + TÊN TỰ ĐỘNG CHUYỂN HƯỚNG SANG PROFILE KHI BẤM */}
                <Link to={user.role === 'admin' ? '/admin/dashboard' : (user.role === 'doctor' ? '/doctor-dashboard' : '/profile')} 
  className="header__profile-link"
  title="Đi đến trang cá nhân"
>
  <div className="header__avatar">
    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
  </div>
  <span className="user-name" style={{ cursor: 'pointer' }}>Chào, {user.full_name}</span>
</Link>
                
                <button onClick={handleLogout} className="btn header__action--signup btn--logout-custom">
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="header__action--login">Log In</Link>
                <Link to="/signup" className="btn header__action--signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {isHome && (
          <section className="hero">
            <section className="hero__content">
              <h1 className="hero__heading">Exceptional dental care for all ages.</h1>
              <p className="hero__desc">Exceptional dental care for all ages. Your great smile begins with a great dentist.</p>
              <div className="hero__row">
                <a href="#!" onClick={handleBookingClick} className="btn">Book Online</a>
                <span className="hero__phone">or call (123) 456-7890</span>
              </div>
            </section>

            <div className="hero__media">
              <figure className="hero__images">
                <img src="/assets/img/hero-1.jpg" alt="Exceptional dental care" className="hero__img hero__img-large" />
                <img src="/assets/img/hero-2.jpg" alt="Exceptional dental care" className="hero__img hero__img-small" />
              </figure>
            </div>
          </section>
        )}
      </div>
    </header>
  );
}