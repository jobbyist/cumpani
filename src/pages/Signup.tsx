import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SignupForm } from '@/components/AuthForms';

const Signup = () => {
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
