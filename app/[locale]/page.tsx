import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import ServicesSection from '@/components/ServicesSection';
import GallerySection from '@/components/GallerySection';
import ExperiencesSection from '@/components/ExperiencesSection';
import WhySection from '@/components/WhySection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WelcomeSection />
      <ServicesSection />
      <GallerySection />
      <ExperiencesSection />
      <WhySection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
