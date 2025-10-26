import Hero from '@/components/Hero';
import ProductHome from '@/components/ProductHome';
import Validate from '@/components/Validate';
import BenefitsNewsletter from '@/components/BenefitsNewsletter';
import Footer from '@/components/Footer';
import UserDebugInfo from '@/components/UserDebugInfo';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductHome />
      <Validate />
      <BenefitsNewsletter />
      <Footer />
      
      {/* Debug component - shows user data in bottom right */}
      <UserDebugInfo />
    </main>
  );
}
