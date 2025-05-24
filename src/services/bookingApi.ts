// bookingApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BookingData,
  BookingResponse,
  UserCancelSeatRequest,
  UserCancelSeatResponse,
  UserTripHistoryResponse
} from '../types/user/bookingTypes';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  tagTypes: ['Booking', 'TripSeats'],
  
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/user/',
    prepareHeaders: (headers) => {
      const token =localStorage.getItem('authToken')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  
  endpoints: (builder) => ({
    bookSeats: builder.mutation<BookingResponse, BookingData>({
      query: (data) => ({
        url: 'book',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking', 'TripSeats'],
    }),
    
    history: builder.query<UserTripHistoryResponse, void>({
      query: () => ({
        url: 'history',
        method: 'GET',
      }),
      providesTags: ['Booking'],
    }),
    
    cancelSeats: builder.mutation<UserCancelSeatResponse, UserCancelSeatRequest>({
      query: (data) => ({
        url: 'cancelBooking',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking', 'TripSeats'],
    }),
  }),
});

export const {
  useBookSeatsMutation,
  useHistoryQuery,
  useCancelSeatsMutation,
} = bookingApi;