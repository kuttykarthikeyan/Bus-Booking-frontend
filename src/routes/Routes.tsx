import { Navigate, Route, Routes,Outlet } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import TripPage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import BookingPage from '../pages/BookingPage';
import HistoryPage from '../pages/HistoryPage';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route 
        element={<ProtectedRoute><Outlet /></ProtectedRoute>} 
      >
        <Route path="/trip" element={<TripPage />} />
        <Route path="/trip/booking/:trip_id" element={<BookingPage />} />
        <Route path="/bookings" element={<HistoryPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/trip" replace />} />

      <Route path="*" element={<Navigate to="/trip" replace />} />
    </Routes>
  );
};

export default AppRoutes;
