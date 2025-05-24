import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TripFilterResponse, TripQuery, TripResponse, } from '../types/user/tripTypes';
import { BookingData, BookingResponse, UserTripHistoryResponse } from '../types/user/bookingTypes';

export const tripApi = createApi({
  reducerPath: 'tripApi',
  tagTypes: ['TripSeats','Booking'],
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
    getTripsByFilter: builder.mutation<TripFilterResponse, TripQuery>({
      query: (filter) => ({
        url: 'trip',
        method: 'POST',
        body: filter,
      }),
     invalidatesTags:['TripSeats'],

    }),
  
    getTripById: builder.query<TripResponse, {trip_id:string}>({
      query: (tripSelect) => ({
        url: `trip/${tripSelect.trip_id}`,
        method: 'GET',
      }),
     providesTags:  ['TripSeats'],
      
    }),
   
  }),
});

export const { useGetTripsByFilterMutation, useGetTripByIdQuery } = tripApi;

