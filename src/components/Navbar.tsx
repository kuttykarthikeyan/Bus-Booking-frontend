import  { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { bookingApi } from "../services/bookingApi"; 
import { tripApi } from "../services/tripApi"; 
import { userApi } from "../services/userApi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
const handleButtonClick = () => {
  if (location.pathname === '/register' || location.pathname === '/login') {
    navigate(location.pathname === '/register' ? '/login' : '/register');
  } else {
    handleLogout(); 
  }
};

  const handleLogout = () => {
    navigate('/login');
    
    dispatch(bookingApi.util.resetApiState());
    dispatch(tripApi.util.resetApiState());
    dispatch(userApi.util.resetApiState());
    localStorage.removeItem('authToken');
    
    setShowLogoutConfirm(false);
    
  };

  const isLoggedIn = localStorage.getItem('authToken') !== null;

  let buttonLabel = 'Register';
  if (location.pathname === '/register') {
    buttonLabel = 'Login';
  } else if (location.pathname === '/login') {
    buttonLabel = 'Register';
  } else {
    buttonLabel = 'Logout';
  }

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  ExpressBus
                </span>
              </div>
              <div className="ml-6 flex items-center space-x-4">
                <button
                  onClick={() => navigate('/trip')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Find Buses
                </button>
                {/* <button
                  onClick={() => navigate('#')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Routes
                </button>
                <button
                  onClick={() => navigate('#')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Offers */}
                {/* </button> */}
                {isLoggedIn && (
                  <button
                    onClick={() => navigate('/bookings')}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                  >
                    My Bookings
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/support')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Support
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Profile
                </button>
              )}
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" data-testid="logout-modal">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to log out? This will clear all your session data.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                data-testid="cancel-logout"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                data-testid="confirm-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}