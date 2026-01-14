import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border" role="contentinfo">
      <div className="container-blog py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
              <Link to="/" className="inline-flex" aria-label="Cumpani home">
              <img
                src="/cumpaniblk.svg"
                alt="Cumpani"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/cumpaniwht.svg"
                alt="Cumpani"
                className="hidden h-8 w-auto dark:block"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your premier companion service connecting you with attractive companions across South Africa.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/companions" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Browse Companions</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">How It Works</Link></li>
              <li><Link to="/signup" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Sign Up</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Login</Link></li>
            </ul>
          </div>
          
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Contact</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Terms</Link></li>
              </ul>
            </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Cumpani. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
