import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, MessagesSquare, MessageCircle, SlidersHorizontal, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { INTEREST_OPTIONS, useOrientation, type Interest } from '@/contexts/OrientationContext';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

/** Floating mobile navigation with a Filter tab ("I'm interested in"). Visible to everyone. */
const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  const { interest, setInterest } = useOrientation();
  const [open, setOpen] = useState(false);
  const items = isAuthenticated ? memberItems : guestItems;
  const active = interest !== 'everyone';

  return (
    <>
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
            <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
              className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              Filter
              {active && <span className="absolute right-[28%] top-2 h-2 w-2 rounded-full bg-primary" aria-label="Filter active" />}
            </button>
          </li>
          {!isAuthenticated && (
            <li className="flex-1">
              <NavLink to="/signup" className={linkClass}>
                <LogIn className="h-5 w-5" aria-hidden="true" />
                Join
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md px-4 pb-8">
            <DrawerHeader className="px-0">
              <DrawerTitle>I'm interested in</DrawerTitle>
              <DrawerDescription>
                Surfaces matching reels and profiles. Your choice stays in this browser, and is saved to your
                account only if you have consented to processing of special personal information.
              </DrawerDescription>
            </DrawerHeader>
            <RadioGroup value={interest} onValueChange={(v) => { setInterest(v as Interest); setOpen(false); }} className="gap-3">
              {INTEREST_OPTIONS.map((o) => (
                <div key={o.value} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <RadioGroupItem value={o.value} id={`interest-${o.value}`} />
                  <Label htmlFor={`interest-${o.value}`} className="flex-1 cursor-pointer">{o.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BottomNav;
