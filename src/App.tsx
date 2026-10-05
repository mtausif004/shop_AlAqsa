import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { FloatingActions } from './components/FloatingActions';

import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { OffersPage } from './pages/OffersPage';
import { CombosPage } from './pages/CombosPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { InvoicePage } from './pages/InvoicePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage, TermsPage } from './pages/PolicyPages';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { route, navigate } = useRouter();

  if (route === 'admin') {
    return <AdminPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2F4858]">
      <Header />
      <main className="flex-1">
        {route === 'home' && <HomePage />}
        {route === 'product' && <ProductDetailPage />}
        {route === 'category' && <CategoryPage />}
        {route === 'search' && <SearchPage />}
        {route === 'offers' && <OffersPage />}
        {route === 'combo' && <CombosPage />}
        {route === 'cart' && <CartPage />}
        {route === 'checkout' && <CheckoutPage />}
        {route === 'track-order' && <TrackOrderPage />}
        {route === 'invoice' && <InvoicePage />}
        {route === 'about' && <AboutPage />}
        {route === 'contact' && <ContactPage />}
        {route === 'faq' && <FaqPage />}
        {route === 'privacy' && <PrivacyPage />}
        {route === 'terms' && <TermsPage />}
        {route === 'not-found' && (
          <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
            <h1 className="font-serif text-3xl font-extrabold text-[#6B352A]">৪০৪ - পৃষ্ঠাটি পাওয়া যায়নি</h1>
            <p className="text-xs text-stone-500">
              আপনি যে পৃষ্ঠাটি খুঁজছেন তা স্থানান্তরিত হয়েছে অথবা উপলব্ধ নেই।
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#6B352A] text-[#FFF1A6] font-bold text-xs px-6 py-3 rounded-full hover:bg-[#52271E] transition"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        )}
      </main>
      <Footer />
      <CartDrawer />
      <FloatingActions />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </RouterProvider>
  );
}
