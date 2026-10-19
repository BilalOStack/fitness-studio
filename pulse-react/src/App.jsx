import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#121220] text-[#eaeaf0] flex flex-col overflow-x-hidden selection:bg-[#e63946] selection:text-white">
      <Header />
      <Hero />
      <MainContent />
      <Footer />
    </div>
  );
}
