import Services from '../components/Services';
import HowItWorks from '../components/HowItWorks';
import About from '../components/About';
import Team from '../components/Team';
import Install from '../components/Install';
import Blog from '../components/Blog';
import Appointment from '../components/Appointment';

export default function Home() {
  return (
    <main>
      <Services />
      <HowItWorks />
      <About />
      <Team />
      <Install />
      <Blog />
      <Appointment />
    </main>
  );
}