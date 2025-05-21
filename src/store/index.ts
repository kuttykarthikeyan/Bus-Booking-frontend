import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../services/userApi';
import  userReducer  from '../store/user/userSlice';
import { tripApi } from '../services/tripApi';
import { bookingApi } from '../services/bookingApi';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [tripApi.reducerPath]:tripApi.reducer,
    [bookingApi.reducerPath]:bookingApi.reducer,

    user:userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware,tripApi.middleware,bookingApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
 