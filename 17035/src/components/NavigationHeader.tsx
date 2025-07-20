
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vote, LogOut, User, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const NavigationHeader = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pollsCount, setPollsCount] = useState(0);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!error && data?.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    const fetchPollsCount = async () => {
      try {
        const { count, error } = await supabase
          .from('polls')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        if (!error) {
          setPollsCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching polls count:', error);
      }
    };

    checkAdminStatus();
    fetchPollsCount();

    // Set up real-time subscription for polls count
    const pollsSubscription = supabase
      .channel('polls-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'polls' }, () => {
        fetchPollsCount();
      })
      .subscribe();

    return () => {
      pollsSubscription.unsubscribe();
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const navigationItems = [
    { name: 'Home', path: '/', badge: null },
    { name: 'Polls', path: '/polls', badge: `${pollsCount} Active` },
    { name: 'Elections', path: '/elections', badge: 'Coming Soon' },
    { name: 'Results', path: '/results', badge: 'Live' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin', badge: 'Admin' }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">VoteHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-9 w-9 p-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* User Info (Desktop) */}
            <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm">{user?.email}</span>
              {isAdmin && (
                <Badge variant="outline" className="text-xs">Admin</Badge>
              )}
            </div>

            {/* Sign Out (Desktop) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="hidden md:flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 p-0"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-2 mt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile User Info & Sign Out */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-muted-foreground mb-3">
                <User className="h-4 w-4" />
                <span className="text-sm">{user?.email}</span>
                {isAdmin && (
                  <Badge variant="outline" className="text-xs">Admin</Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
