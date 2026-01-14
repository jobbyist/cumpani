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
                className="w-[200px] h-auto dark:hidden"
              />
              <img
                src="/cumpaniwht.svg"
                alt="Cumpani"
                className="hidden w-[200px] h-auto dark:block"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your premier cumpanion service connecting you with attractive cumpanions across South Africa.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/companions" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Browse Cumpanions</Link></li>
              <li><Link to="/become-companion" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Become A Cumpanion</Link></li>
              <li><Link to="/membership" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Join The Cummunity</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">How It Works</Link></li>
            </ul>
          </div>
          
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Terms</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Privacy</Link></li>
                <li><Link to="/refunds" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Refunds</Link></li>
                <li><Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Cookies</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Contact</Link></li>
                <li className="text-muted-foreground">Need help?</li>
                <li><a href="mailto:help@cumpani.fun" className="text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">help@cumpani.fun</a></li>
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
