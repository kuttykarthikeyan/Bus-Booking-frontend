import { getValidToken } from '../../utils/authUtils';

describe('getValidToken', () => {
  const realLocalStorage = global.localStorage;

  beforeEach(() => {
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};

      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
    });
  });
  afterEach(() => {

    Object.defineProperty(global, 'localStorage', {
      value: realLocalStorage,
    });
  });

  it('should return null if no authToken is found', () => {
    expect(getValidToken()).toBeNull();
  });

  it('should return null if authToken is invalid JSON', () => {
    localStorage.setItem('authToken', 'not-json');
    expect(getValidToken()).toBeNull();
  });

  it('should return null if token is expired', () => {
    const expiredToken = {
      token: 'expired-token',
      expiry: Date.now() - 1000, 
    };
    localStorage.setItem('authToken', JSON.stringify(expiredToken));
    expect(getValidToken()).toBeNull();
  });

  it('should return the token if it is valid and not expired', () => {
    const validToken = {
      token: 'valid-token',
      expiry: Date.now() + 10000,
    };
    localStorage.setItem('authToken', JSON.stringify(validToken));
    expect(getValidToken()).toBe('valid-token');
  });
});
