import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Auth from './pages/Auth'; 
import Doctors from './pages/Doctors';
import DoctorDetail from './pages/DoctorDetail';
import About from './pages/About';
import Services from './pages/Services';
import AllServices from './pages/AllServices';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard'; 
import BookingConfirmation from './pages/BookingConfirmation';
import Profile from './pages/Profile';

function App() {
  return (
    // BẮT BUỘC phải có thẻ BrowserRouter bọc ngoài cùng ở đây
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/all-services" element={<AllServices />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;