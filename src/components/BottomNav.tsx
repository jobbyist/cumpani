import { NavLink, Link } from 'react-router-dom';
import { Home, Users, MessagesSquare, MessageCircle, LayoutGrid, LogIn, Film, HeartHandshake, Info, Phone, HelpCircle, Sparkles, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { INTEREST_OPTIONS, useOrientation, type Interest } from '@/contexts/OrientationContext';
import { memberPhase, effectiveNow } from '@/lib/launch';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const memberItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/companions', label: 'Companions', icon: Users },
  { to: '/feed', label: 'Community', icon: MessagesSquare },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
];
const guestItems = [{ to: '/', label: 'Home', icon: Home, end: true }];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
  }`;

/** Floating mobile navigation. "Browse" opens a menu of key pages plus the "I'm interested in" filter. */
const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const { interest, setInterest } = useOrientation();
  const items = isAuthenticated ? memberItems : guestItems;
  const active = interest !== 'everyone';
  const live = memberPhase(effectiveNow()) === 'live';

  const links = [
    { to: '/companions', label: 'Verified companions', icon: Users },
    { to: '/', label: 'Featured reels', icon: Film, hash: '#reels' },
    { to: '/feed', label: 'Community feed', icon: MessagesSquare },
    { to: live ? '/membership' : '/early-access', label: live ? 'Membership' : 'Get early access', icon: Sparkles },
    { to: '/become-companion', label: 'Become a companion', icon: Mail },
    { to: '/how-it-works', label: 'How it works', icon: HelpCircle },
    { to: '/safety', label: 'Safety Centre (LGBT-inclusive)', icon: HeartHandshake },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border bg-background/90 shadow-lg backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} end={end} className={linkClass}>
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
        <li className="flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors focus:outline-none ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
              Browse
              {active && <span className="absolute right-[28%] top-2 h-2 w-2 rounded-full bg-primary" aria-label="Filter active" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" sideOffset={12} className="max-h-[70vh] w-72 overflow-y-auto">
              <DropdownMenuLabel>Browse</DropdownMenuLabel>
              {links.map(({ to, label, icon: Icon, hash }) => (
                <DropdownMenuItem key={label} asChild>
                  <Link to={to + (hash ?? '')}><Icon className="mr-2 h-4 w-4" aria-hidden="true" />{label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>I'm interested in</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={interest} onValueChange={(v) => setInterest(v as Interest)}>
                {INTEREST_OPTIONS.map((o) => (
                  <DropdownMenuRadioItem key={o.value} value={o.value} onSelect={(e) => e.preventDefault()}>{o.label}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <p className="px-2 pb-2 pt-1 text-[11px] text-muted-foreground">Saved in this browser only unless you consent to saving it to your account.</p>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        {!isAuthenticated && (
          <li className="flex-1">
            <NavLink to={live ? '/signup' : '/early-access'} className={linkClass}>
              <LogIn className="h-5 w-5" aria-hidden="true" />
              {live ? 'Join' : 'Waitlist'}
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default BottomNav;
