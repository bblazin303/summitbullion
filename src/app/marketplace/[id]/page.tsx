import NavBar from '@/components/NavBar';
import ProductDetail from '@/components/ProductDetail';
import Footer from '@/components/Footer';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="bg-white">
      <NavBar />
      <ProductDetail productId={id} />
      <Footer />
    </main>
  );
}

