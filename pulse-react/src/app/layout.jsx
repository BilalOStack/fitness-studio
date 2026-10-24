import '../index.css';
import { AuthProvider } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export const metadata = {
  title: 'PulseFit - Elite Fitness & Group Training Studio',
  description: 'HIIT, Strength, Yoga, and Boxing classes taught by certified coaches in Portland.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#121220] text-[#eaeaf0] flex flex-col overflow-x-hidden selection:bg-[#e63946] selection:text-white">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
