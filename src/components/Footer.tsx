import { Link } from 'react-router-dom';
import Disclaimer from '@/components/Disclaimer';
import { COMPANY } from '@/lib/company';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border pb-24 lg:pb-0" role="contentinfo">
      <div className="container-blog py-10 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="inline-flex" aria-label="Cumpani home">
              <img src="/cumpaniblk.svg" alt="Cumpani" className="h-11 w-auto max-w-[190px] object-contain dark:hidden" />
              <img src="/cumpaniwht.svg" alt="Cumpani" className="hidden h-11 w-auto max-w-[190px] object-contain dark:block" />
            </Link>
            <p className="text-sm text-muted-foreground">
              A members-only social and dating platform for verified adults (21+) across South Africa.
            </p>
          </div>

          <nav aria-label="Explore" className="space-y-3">
            <h3 className="font-semibold text-sm">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/how-it-works" className="hover:text-primary">How It Works</Link></li>
              <li><Link to="/membership" className="hover:text-primary">Membership</Link></li>
              <li><Link to="/become-companion" className="hover:text-primary">Become a Companion</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
            </ul>
          </nav>

          <nav aria-label="Legal" className="space-y-3">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-primary">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/acceptable-use" className="hover:text-primary">Acceptable Use</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-primary">Community Guidelines</Link></li>
              <li><Link to="/refunds" className="hover:text-primary">Refunds &amp; Cancellations</Link></li>
              <li><Link to="/cookies" className="hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </nav>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary">Contact us</Link></li>
              <li><a href={`mailto:${COMPANY.supportEmail}`} className="hover:text-primary">{COMPANY.supportEmail}</a></li>
              <li>Report abuse or trafficking: 0800 222 777</li>
            </ul>
          </div>
        </div>

        <Disclaimer compact />

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {COMPANY.legalName}. Reg. {COMPANY.registrationNumber}. {COMPANY.physicalAddress}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
