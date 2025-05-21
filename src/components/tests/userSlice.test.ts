import userReducer, { setUser } from '../../store/user/userSlice';
import { User } from '../../types/user/userTypes';

describe('userSlice', () => {
  const initialState = {
    currentUser: null,
  };

  it('should return the initial state when passed an empty action', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle setUser and update currentUser', () => {
    const mockUser: User = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      phone:"1234567890",
      role:"user",
      createdAt:"timing"
    };

    const action = setUser(mockUser);
    const result = userReducer(initialState, action);

    expect(result.currentUser).toEqual(mockUser);
  });
});
