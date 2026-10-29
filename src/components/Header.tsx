import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Wallet, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import StoriesBar from './StoriesBar';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, walletBalance, isCompanion, isAdmin } = useAuth();

  const navItems = isAuthenticated
    ? [
        { name: 'COMPANIONS', href: '/companions' },
        { name: 'COMMUNITY', href: '/feed' },
        { name: 'MESSAGES', href: '/messages' },
        { name: 'HOW IT WORKS', href: '/how-it-works' },
      ]
    : [
        { name: 'HOW IT WORKS', href: '/how-it-works' },
        { name: 'ABOUT', href: '/about' },
        { name: 'MEMBERSHIP', href: '/membership' },
        { name: 'CONTACT', href: '/contact' },
      ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container-blog border-b border-border/50 empty:hidden">
        <StoriesBar />
      </div>
      <div className="container-blog">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
             <Link to="/" className="block" aria-label="Cumpani home">
              <img src="/cumpaniblk.svg" alt="Cumpani" className="h-9 sm:h-11 w-auto max-w-[190px] object-contain dark:hidden" />
              <img src="/cumpaniwht.svg" alt="Cumpani" className="hidden h-9 sm:h-11 w-auto max-w-[190px] object-contain dark:block" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social Links & Search */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={() => navigate('/wallet')} aria-label="Wallet">
                <Wallet className="h-4 w-4 mr-2" />
                {walletBalance.toLocaleString()} credits
              </Button>
            )}
            <ThemeToggle />
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin
                    </DropdownMenuItem>
                  )}
                  {isCompanion && (
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/wallet')}>
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-6 space-y-4">
              <div className="flex space-x-2 items-center">
                <ThemeToggle />
              </div>
              
              {isAuthenticated ? (
                <>
                  <div className="text-sm text-muted-foreground px-2">
                    Logged in as: {user?.name}
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="w-full">
                    Login
                  </Button>
                  <Button size="sm" onClick={() => navigate('/signup')} className="w-full">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
