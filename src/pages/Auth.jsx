import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/auth.css';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  const [regData, setRegData] = useState({
    full_name: '', phone: '', email: '', password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '', password: ''
  });

  useEffect(() => {
    setIsRightPanelActive(location.pathname === '/signup');
  }, [location.pathname]);

  const handleRegChange = (e) => setRegData({ ...regData, [e.target.name]: e.target.value });
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });

  // =====================================
  // REGISTER (PATIENT)
  // =====================================
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await response.json();

      if (response.ok) {
        alert("🎉 Registration successful! Please log in to continue.");
        setIsRightPanelActive(false); 
        navigate('/login');
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      alert("Unable to connect to the server!");
    }
  };

  // =====================================
  // LOGIN & ROLE REDIRECTION
  // =====================================
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.full_name}!`);

        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (data.user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/booking'); 
        }
      } else {
        alert("❌ " + data.error);
      }
    } catch (error) {
      alert("Server connection error!");
    }
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
        
        {/* SIGN UP FORM */}
        <div className="auth-form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <span>For new patients</span>
            <input 
              type="text" name="full_name" placeholder="Full Name" required 
              value={regData.full_name} onChange={handleRegChange} 
            />
            <input 
              type="text" name="phone" placeholder="Phone Number" required 
              value={regData.phone} onChange={handleRegChange} 
            />
            <input 
              type="email" name="email" placeholder="Email" required 
              value={regData.email} onChange={handleRegChange} 
            />
            <input 
              type="password" name="password" placeholder="Password" required 
              value={regData.password} onChange={handleRegChange} 
            />
            <button type="submit" className="auth-btn">Sign Up</button>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="auth-form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            <span>Access your medical records</span>
            <input 
              type="email" name="email" placeholder="Email" required 
              value={loginData.email} onChange={handleLoginChange} 
            />
            <input 
              type="password" name="password" placeholder="Password" required 
              value={loginData.password} onChange={handleLoginChange} 
            />
            <a href="#!">Forgot your password?</a>
            <button type="submit" className="auth-btn">Log In</button>
          </form>
        </div>

        {/* OVERLAY SLIDER */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>Please log in to view your appointments and medical records.</p>
              <button className="auth-btn ghost" onClick={() => navigate('/login')}>Log In</button>
            </div>
            <div className="auth-overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Sign up now to experience the best healthcare services.</p>
              <button className="auth-btn ghost" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}