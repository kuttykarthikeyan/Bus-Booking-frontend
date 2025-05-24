import { useState, ChangeEvent, FormEvent } from "react";
import { LoginUser } from "../../types/user/userTypes";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from '../../services/userApi';
import { loginSuccess } from '../../store/user/userSlice';
import { useDispatch } from "react-redux";
import {
  FetchBaseQueryError
} from '@reduxjs/toolkit/query';
import {
  SerializedError
} from '@reduxjs/toolkit';

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' &&
    error !== null &&
    'status' in error;
}

function isSerializedError(error: unknown): error is SerializedError {
  return typeof error === 'object' &&
    error !== null &&
    'message' in error;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginUser>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }
   try {
  setLoading(true);
  const response = await loginUser(formData).unwrap();

  if (response.data.user) {
    dispatch(loginSuccess({
      user: response.data.user,
      token: response.data.token
    }));

    navigate("/trip");
  } else {
    setError('Login failed: No token received');
  }

} catch (err) {
  if (isFetchBaseQueryError(err)) {
    const errorMessage = (err.data as { message?: string })?.message || 'Login failed.';
    setError(errorMessage);
  } else if (isSerializedError(err)) {
    setError(err.message || 'An unexpected error occurred.');
  } else {
    // Fallback
    setError('An unknown error occurred.');
  }
} finally {
  setLoading(false);
}
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
         
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={navigateToRegister}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register now
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}