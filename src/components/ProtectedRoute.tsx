import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Require an email-confirmed session (default). */
  requireVerified?: boolean;
  requireSubscription?: boolean;
  requireCompanion?: boolean;
}

/**
 * Gate order: signed in -> (companion role) -> verified -> subscribed.
 * Server-side RLS is the real enforcement; this only controls navigation.
 */
const ProtectedRoute = ({
  children,
  requireVerified = true,
  requireSubscription = true,
  requireCompanion = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isVerified, isSubscribed, isCompanion, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (requireCompanion && !isCompanion) return <Navigate to="/" replace />;
  if (requireVerified && !isVerified) return <Navigate to="/verify" replace />;
  if (requireSubscription && !isSubscribed) return <Navigate to="/membership" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
