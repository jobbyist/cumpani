import { NavLink } from 'react-router-dom';
import { Home, Users, MessagesSquare, MessageCircle, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/companions', label: 'Companions', icon: Users },
  { to: '/feed', label: 'Community', icon: MessagesSquare },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
];

/** Floating mobile navigation. Only shown to signed-in members. */
const BottomNav = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-border bg-background/90 shadow-lg backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNav;
