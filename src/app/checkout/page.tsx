import NavBar from '@/components/NavBar';
import CheckoutComponent from '@/components/CheckoutComponent';

export default function CheckoutPage() {
  console.log('CheckoutPage component loaded');
  
  return (
    <main className="bg-white h-screen flex flex-col overflow-hidden">
      <NavBar />
      <CheckoutComponent />
    </main>
  );
}

