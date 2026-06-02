import { Navigate, Outlet } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';

export default function ProtectedRoute() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
