import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, MessagesSquare, MessageCircle, Compass, LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

const memberItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/companions', label: 'Companions', icon: Users },
  { to: '/feed', label: 'Community', icon: MessagesSquare },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
];
const guestItems = [{ to: '/', label: 'Home', icon: Home, end: true }, { to: '/companions', label: 'Discover', icon: Users }];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
  }`;

/** Floating mobile navigation with a Explorer tab ("I'm interested in"). Visible to everyone. */
const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  
  const [open, setOpen] = useState(false);
  const items = isAuthenticated ? memberItems : guestItems;
  const explorerItems = [{to:'/companions',label:'Discover companions',icon:Users},{to:'/feed',label:'Community',icon:MessagesSquare},{to:'/messages',label:'Messages',icon:MessageCircle},{to:'/membership',label:'Membership',icon:ShieldCheck},{to:'/dashboard',label:'Your dashboard',icon:Compass},{to:'/verify',label:'Identity verification',icon:UserPlus}];


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
              <Compass className="h-5 w-5" aria-hidden="true" />
              Filter
              
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
        <DrawerContent><div className="mx-auto w-full max-w-md px-4 pb-8">
          <DrawerHeader className="px-0"><DrawerTitle>Explore Cumpani</DrawerTitle><DrawerDescription>Quick access to the places that matter.</DrawerDescription></DrawerHeader>
          <div className="grid grid-cols-2 gap-3">{explorerItems.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="flex min-h-24 flex-col justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/60 hover:bg-muted"><Icon className="h-5 w-5 text-primary" aria-hidden="true"/><span className="text-sm font-medium">{label}</span></NavLink>)}</div>
        </div></DrawerContent>
      </Drawer>
    </>
  );
};

export default BottomNav;
