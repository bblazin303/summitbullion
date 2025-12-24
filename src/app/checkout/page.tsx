import NavBar from '@/components/NavBar';
import CheckoutComponent from '@/components/CheckoutComponent';

export default function CheckoutPage() {
  
  return (
    <main className="bg-white h-screen flex flex-col overflow-hidden">
      <NavBar />
      <CheckoutComponent />
    </main>
  );
}

