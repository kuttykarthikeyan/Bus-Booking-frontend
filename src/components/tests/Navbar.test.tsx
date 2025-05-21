import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../Navbar';
import { bookingApi } from '../../services/bookingApi';
import { tripApi } from '../../services/tripApi';
import { userApi } from '../../services/userApi';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(() => ({ pathname: '/' })),
  useNavigate: jest.fn(() => jest.fn()),
  MemoryRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock('../../services/bookingApi', () => ({
  __esModule: true,
  ...jest.requireActual('../../services/bookingApi'),
  util: {
    resetApiState: jest.fn(),
  },
}));

jest.mock('../../services/tripApi', () => ({
  __esModule: true,
  ...jest.requireActual('../../services/tripApi'),
  util: {
    resetApiState: jest.fn(),
  },
}));

jest.mock('../../services/userApi', () => ({
  __esModule: true,
  ...jest.requireActual('../../services/userApi'),
  util: {
    resetApiState: jest.fn(),
  },
}));

describe('Navbar', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (require('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (require('react-redux').useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (require('react-redux').useSelector as jest.Mock).mockImplementation((selector) => selector({}));
    
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderNavbar = (pathname = '/') => {
    (require('react-router-dom').useLocation as jest.Mock).mockReturnValue({ pathname });
    return render(
      <Provider store={configureStore({ reducer: {} })}>
        <MemoryRouter initialEntries={[pathname]}>
          <Navbar />
        </MemoryRouter>
      </Provider>
    );
  };


  it('shows login/register buttons when not authenticated', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
    
    renderNavbar('/register');
    expect(screen.getByText('Login')).toBeInTheDocument();

    renderNavbar('/login');
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('navigates to correct pages when links are clicked', () => {
    renderNavbar();

    fireEvent.click(screen.getByText('ExpressBus'));
    expect(mockNavigate).toHaveBeenCalledWith('/');

    fireEvent.click(screen.getByText('Find Buses'));
    expect(mockNavigate).toHaveBeenCalledWith('/trip');
  });

  it('handles logout flow correctly', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue('token');
    renderNavbar();

    fireEvent.click(screen.getByText('Logout'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });

  it('toggles between login and register buttons on auth pages', () => {
    (window.localStorage.getItem as jest.Mock).mockReturnValue(null);

    renderNavbar('/register');
    fireEvent.click(screen.getByText('Login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    renderNavbar('/login');
    fireEvent.click(screen.getByText('Register'));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

it('shows My Bookings button when logged in', () => {
  (window.localStorage.getItem as jest.Mock).mockReturnValue('token');
  renderNavbar();

  expect(screen.getByText('My Bookings')).toBeInTheDocument();

  fireEvent.click(screen.getByText('My Bookings'));
  expect(mockNavigate).toHaveBeenCalledWith('/bookings');
});
it('navigates to support and profile when logged in', () => {
  (window.localStorage.getItem as jest.Mock).mockReturnValue('token');
  renderNavbar();

  fireEvent.click(screen.getByText('Support'));
  expect(mockNavigate).toHaveBeenCalledWith('/support');

  fireEvent.click(screen.getByText('Profile'));
  expect(mockNavigate).toHaveBeenCalledWith('/profile');
});

it('does not crash if some links are missing in DOM', () => {
  (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
  renderNavbar('/some-invalid-path');

  expect(() => screen.getByText('NonExistent')).toThrow(); 
});

it('dispatches an action on logout', () => {
  (window.localStorage.getItem as jest.Mock).mockReturnValue('token');
  renderNavbar();

  fireEvent.click(screen.getByText('Logout'));
  expect(mockDispatch).toHaveBeenCalled(); 
});

it('dispatches reset actions on logout', () => {
  (window.localStorage.getItem as jest.Mock).mockReturnValue('token');
  renderNavbar();

  fireEvent.click(screen.getByText('Logout'));

  expect(mockDispatch).toHaveBeenCalledWith(bookingApi.util.resetApiState());
  expect(mockDispatch).toHaveBeenCalledWith(tripApi.util.resetApiState());
  expect(mockDispatch).toHaveBeenCalledWith(userApi.util.resetApiState());
});



});