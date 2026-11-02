import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import HowItWorks from './components/home/HowItWorks';
import About from './components/home/About';

export default function Home() {
  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <Navbar />
      <Hero />
      <HowItWorks />
      <About />
      <Footer />
    </main>
  );
}
