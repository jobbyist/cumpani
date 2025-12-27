import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
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
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { name: 'ALL POST', href: '/posts' },
    { name: 'BUSINESS', href: '/business' },
    { name: 'TECHNOLOGY', href: '/technology' },
    { name: 'PODCAST', href: '/podcast' },
    { name: 'REQUEST QUOTE', href: '/quote-request' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },  
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container-blog">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <h1 className="text-2xl font-bold text-foreground tracking-tight uppercase">gravitas</h1>
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
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Button key={label} variant="outline" size="sm" asChild>
                <a href={href} aria-label={label}>
                  <Icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              aria-label="Search articles"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4" />
            </Button>
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
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Button key={label} variant="outline" size="sm" asChild>
                    <a href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
                
                <ThemeToggle />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                aria-label="Search articles"
                onClick={() => navigate('/search')}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
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