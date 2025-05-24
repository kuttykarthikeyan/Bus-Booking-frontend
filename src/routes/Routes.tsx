import { Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import PageFallback from '../pages/user/PageFallBack';
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const HomePage = lazy(() => import('../pages/user/HomePage'));
const BookingPage = lazy(() => import('../pages/user/BookingPage'));
const HistoryPage = lazy(() => import('../pages/user/HistoryPage'));
const AppRoutes = () => {
  return (
    <Suspense fallback={
   <PageFallback/>
  }>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
          <Route path="/trip" element={<HomePage />} />
          <Route path="/trip/booking/:trip_id" element={<BookingPage />} />
          <Route path="/bookings" element={<HistoryPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/trip" replace />} />
        <Route path="*" element={<Navigate to="/trip" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
