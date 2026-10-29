import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const LABELS: Record<string, string> = {
  companions: 'Companions',
  companion: 'Companions',
  'how-it-works': 'How It Works',
  about: 'About',
  contact: 'Contact',
  terms: 'Terms of Use',
  privacy: 'Privacy Policy',
  cookies: 'Cookie Policy',
  refunds: 'Refunds & Cancellations',
  'acceptable-use': 'Acceptable Use',
  'community-guidelines': 'Community Guidelines',
  membership: 'Membership',
  wallet: 'Wallet',
  feed: 'Community',
  messages: 'Messages',
  dashboard: 'Dashboard',
  verify: 'Verification',
  login: 'Login',
  signup: 'Sign Up',
  'become-companion': 'Become a Companion',
  sitemap: 'Sitemap',
};

const PageBreadcrumbs = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  const crumbs = parts
    .map((seg, i) => ({ seg, href: '/' + (seg === 'companion' ? 'companions' : parts.slice(0, i + 1).join('/')) }))
    .filter((c) => LABELS[c.seg]);

  return (
    <div className="container-blog pt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((c, i) => (
            <span key={c.href + i} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {i === crumbs.length - 1 && c.seg !== 'companion' ? (
                  <BreadcrumbPage>{LABELS[c.seg]}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild><Link to={c.href}>{LABELS[c.seg]}</Link></BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default PageBreadcrumbs;
