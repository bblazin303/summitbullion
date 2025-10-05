import Hero from '@/components/Hero';
import ProductHome from '@/components/ProductHome';
import Validate from '@/components/Validate';
import BenefitsNewsletter from '@/components/BenefitsNewsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductHome />
      <Validate />
      <BenefitsNewsletter />
      <Footer />
    </main>
  );
}
