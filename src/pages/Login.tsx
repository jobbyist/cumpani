import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginForm } from '@/components/AuthForms';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-14 sm:py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-7 text-center">
            <p className="page-eyebrow">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">Sign in to Cumpani</h1>
            <p className="mt-2 text-sm text-white/60">Your people. Your space. Your account.</p>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-sm leading-7 text-white/60">
            Want to join as a Cumpanion or creator? <Link to="/become-companion" className="font-semibold text-pink-400 underline underline-offset-4">Apply here</Link>.
            <br />
            Looking to meet Cumpanions? <Link to="/join-now" className="font-semibold text-pink-400 underline underline-offset-4">Join Cumpani</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
