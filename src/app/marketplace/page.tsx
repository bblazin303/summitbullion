import NavBar from '@/components/NavBar';
import MarketplaceBanner from '@/components/MarketplaceBanner';
import MarketplaceInventory from '@/components/MarketplaceInventory';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Marketplace() {
  return (
    <main className="bg-[#fcf8f1] pt-[120px] sm:pt-[140px] lg:pt-[160px]">
      <NavBar />
      <MarketplaceBanner />
      <MarketplaceInventory />
      <Newsletter />
      <Footer />
    </main>
  );
}

