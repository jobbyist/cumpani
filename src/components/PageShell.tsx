import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';

/** Standard page chrome. `pb-24` leaves room for the floating bottom nav on mobile. */
const PageShell = ({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) => (
  <div className="min-h-screen bg-background">
    <Header />
    <PageBreadcrumbs />
    <main id="main-content" className={`container-blog py-10 pb-28 lg:pb-12 ${narrow ? 'max-w-3xl' : ''}`}>
      {children}
    </main>
    <Footer />
  </div>
);

export default PageShell;
