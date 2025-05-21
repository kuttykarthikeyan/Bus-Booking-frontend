import { useState, ChangeEvent, useEffect } from 'react';
import { User, Lock, Phone, UserCheck, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { RegisterUser } from '../../types/user/userTypes';
import { useRegisterUserMutation } from '../../services/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { registerSuccess } from '../../store/user/userSlice';
import { RootState } from '../../store/index';
import { useNavigate } from 'react-router-dom';

const initialFormData: RegisterUser = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
};

export const validateRegistrationForm = (formData: RegisterUser): {
  valid: boolean;
  errors: Partial<RegisterUser>;
} => {
  let valid = true;
  const errors: Partial<RegisterUser> = {};

  if (!formData.name.trim()) {
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

  if (!formData.phone) {
    errors.phone = 'Phone number is required';
    valid = false;
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Phone must be a 10-digit number';
    valid = false;
  }

  return { valid, errors };
};

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [formData, setFormData] = useState<RegisterUser>(initialFormData);
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [errors, setErrors] = useState<Partial<RegisterUser>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterUser]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (submitError) setSubmitError(null);
  };


  const validateForm = () => {
    const { valid, errors: newErrors } = validateRegistrationForm(formData);
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await registerUser(formData).unwrap();
          
        if (response.data.user) {
        dispatch(registerSuccess({
         user: response.data.user,
         token: response.data.token
        }));
        navigate('/trip');
        }
    } catch (err: any) {
      console.error('Registration error:', err);
      setSubmitError(err?.data?.message || 'Registration failed. Please try again.');
    }
  }

  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {submitError && (
        <div className="p-4 mb-6 w-full flex items-center bg-red-50 text-red-700 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
       
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-10 pr-10 py-2.5 border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-2.5 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="9876543210"
            />
          </div>
          {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCheck className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={handleLoginClick}
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}