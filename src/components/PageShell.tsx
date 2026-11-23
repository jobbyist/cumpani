import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';

/** Standard page chrome. `pb-24` leaves room for the floating bottom nav on mobile. */
interface PageShellProps {
  children: ReactNode;
  narrow?: boolean;
  /** Full-bleed content rendered between the breadcrumbs and the padded container (e.g. a hero). */
  hero?: ReactNode;
}

const PageShell = ({ children, narrow = false, hero }: PageShellProps) => (
  <div className="min-h-screen bg-neutral-950 text-white">
    <Header />
    <PageBreadcrumbs />
    {hero}
    <main id="main-content" className={`container-blog py-10 pb-28 text-white lg:pb-12 ${narrow ? 'max-w-3xl' : ''}`}>
      {children}
    </main>
    <Footer />
  </div>
);

export default PageShell;
