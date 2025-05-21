import RegistrationForm, { validateRegistrationForm } from '../forms/RegisterForm';
import { render, screen, fireEvent, waitFor,logRoles } from '@testing-library/react';
import * as userApi from '../../services/userApi';
import { RegisterUser } from '../../types/userTypes';
export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
}
export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Please enter a valid email address';
  }

  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null; 
};


export const validateForm = (formData: Partial<RegisterForm>): { valid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  let valid = true;

  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }

  if (!formData.email) {
    errors.email = 'Email is required';
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
    valid = false;
  }

  if (!formData.password) {
    errors.password = 'Password is required';
    valid = false;
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    valid = false;
  }

 

  return { valid, errors };
};


jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn().mockImplementation(() => null),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../../services/userApi', () => ({
  useRegisterUserMutation: jest.fn(),
}));

const mockUseDispatch = jest.fn();
const mockUseSelector = jest.fn().mockImplementation(() => null);
const mockNavigate = jest.fn();

(require('react-redux') as any).useDispatch = () => mockUseDispatch;
(require('react-redux') as any).useSelector = mockUseSelector;
(require('react-router-dom') as any).useNavigate = () => mockNavigate;

describe('RegistrationForm Component', () => {
  let mockRegisterUser: jest.Mock;
  let mockUnwrap: jest.Mock;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUnwrap = jest.fn();
    mockRegisterUser = jest.fn().mockReturnValue({ unwrap: mockUnwrap });
    (userApi.useRegisterUserMutation as jest.Mock).mockReturnValue([
      mockRegisterUser,
      { isLoading: false }
    ]);
    
    mockUseSelector.mockImplementation(() => null);
  });

  const renderForm = () => {
    return render(<RegistrationForm />);
  };
  test('shows error for invalid email format', () => {
  const formData:RegisterUser = {
    name: 'Test',
    email: 'invalidemail.com',
    password: 'password123',
    phone: '1234567890',
  role:'user'
  };

  const result = validateRegistrationForm(formData);

  expect(result.valid).toBe(false);
  expect(result.errors.email).toBe('Please enter a valid email address');
});




test('validates email format', async () => {
  const { container } = renderForm();

  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  logRoles(container); 
});


  test('validates password length', async () => {
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
 const allErrors = await screen.findAllByText(/password must be at least 6 characters/i);
const actualErrors = allErrors.filter(el => el.className.includes('text-red-600'));
expect(actualErrors).toHaveLength(1);


  });

  test('validates phone number format', async () => {
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/phone must be a 10-digit number/i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    renderForm();
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('clears field errors on input change', async () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    mockUnwrap.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        role: 'user',
        createdAt: '2023-01-01'
      }
    });
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
        role: 'user'
      });
      
      expect(mockUseDispatch).toHaveBeenCalled();
    });
  });test('returns error message for invalid emails', () => {
    expect(validateEmail('test.example.com')).toBe('Please enter a valid email address');  
    expect(validateEmail('test@com')).toBe('Please enter a valid email address');          
    expect(validateEmail('test@.com')).toBe('Please enter a valid email address');         
    expect(validateEmail('')).toBe('Please enter a valid email address');                   
    expect(validateEmail('   ')).toBe('Please enter a valid email address');                
  });

  test('returns null for valid emails', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user.name+tag+sorting@example.com')).toBeNull();
  });

  test('handles API error on form submission', async () => {
    mockUnwrap.mockRejectedValue({
      data: { message: 'Registration failed' }
    });
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });

  test('redirects to login page for authenticated users', async () => {
    mockUseSelector.mockImplementation(() => ({ id: '1', name: 'Test User' }));
    
    renderForm();
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('shows loading state during form submission', async () => {
    (userApi.useRegisterUserMutation as jest.Mock).mockReturnValue([
      mockRegisterUser,
      { isLoading: true }
    ]);
    
    renderForm();
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
  });

  test('navigates to login page when Sign In button is clicked', () => {
    renderForm();
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('clears submit error when form input changes', async () => {
    mockUnwrap.mockRejectedValue({
      data: { message: 'Registration failed' }
    });
    
    renderForm();
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    
    expect(screen.queryByText(/registration failed/i)).not.toBeInTheDocument();
  });
});