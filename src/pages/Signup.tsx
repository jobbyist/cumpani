import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SignupForm } from '@/components/AuthForms';
import { memberPhase, effectiveNow } from '@/lib/launch';

/** Member signup opens on launch day; before that, members use the early-access waitlist. */
const Signup = () => {
  if (memberPhase(effectiveNow()) === 'waitlist') return <Navigate to="/early-access" replace />;
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-16">
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
