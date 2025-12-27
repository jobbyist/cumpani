import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoginForm } from '@/components/AuthForms';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-16">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
