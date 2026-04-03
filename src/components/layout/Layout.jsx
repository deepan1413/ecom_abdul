import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';
import AIChat from '../ai/AIChat';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <AIChat />
    </div>
  );
}
