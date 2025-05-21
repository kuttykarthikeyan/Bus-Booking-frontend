import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '../../types/user/userTypes';


const initialState: UserState = {
  currentUser: null,
  userToken: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'), 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{  user: User;token: string }>) => {
      state.userToken = action.payload.token;
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', state.userToken);

    },
    registerSuccess: (state, action: PayloadAction<{ user: User;token: string }>) => {
      state.currentUser = action.payload.user;
      state.userToken = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', state.userToken);
    
    },
    logout: (state) => {
      state.currentUser = null;
      state.userToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
   
  },
});

export const { loginSuccess, registerSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
