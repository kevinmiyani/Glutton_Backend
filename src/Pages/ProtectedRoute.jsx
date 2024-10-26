import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
