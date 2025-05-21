import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../../services/userApi';
import { RegisterUser, LoginUser } from '../../types/userTypes';
import { userBaseQuery } from '../../services/userApi';
global.fetch = jest.fn();

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

const createTestStore = () => {
  return configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });
};

describe('userApi', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    mockedFetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('registerUser mutation', () => {
    it('should register a user successfully', async () => {
  const mockUser: RegisterUser = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'password123',
    role: 'user',
  };

  const mockResponse = {
    data: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
    },
  };

  mockedFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockResponse,
  } as Response);

  const result = await store.dispatch(
    userApi.endpoints.registerUser.initiate(mockUser)
  );

  expect(mockedFetch).toHaveBeenCalledWith(
    expect.objectContaining({
      url: 'http://localhost:8000/api/user/register',
      method: 'POST',
      headers: expect.objectContaining({
        map: expect.objectContaining({
          'content-type': 'application/json',
        }),
      }),
      _bodyInit: JSON.stringify(mockUser),
    })
  );


});



  });

  describe('loginUser mutation', () => {
    
    
   
    it('should handle network error', async () => {
      const mockCredentials: LoginUser = {
        email: 'john@example.com',
        password: 'password123',
      };

      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await store.dispatch(
        userApi.endpoints.loginUser.initiate(mockCredentials)
      );

      expect(result.error).toBeDefined();
      expect(result.error).toMatchObject({
  status: 'FETCH_ERROR',
  error: expect.stringContaining('Network error')
});

    });
  });

  describe('userApi configuration', () => {
    it('should have correct reducer path', () => {
      expect(userApi.reducerPath).toBe('userApi');
    });


  it('should have correct base URL', () => {
    expect(userBaseQuery).toBe('http://localhost:8000/api/user/');
  });

    it('should export correct hooks', () => {
      expect(userApi.useRegisterUserMutation).toBeDefined();
      expect(userApi.useLoginUserMutation).toBeDefined();
    });
  });

  describe('API endpoints structure', () => {
    it('should have registerUser endpoint', () => {
      expect(userApi.endpoints.registerUser).toBeDefined();
    });

    it('should have loginUser endpoint', () => {
      expect(userApi.endpoints.loginUser).toBeDefined();
    });
  });
});