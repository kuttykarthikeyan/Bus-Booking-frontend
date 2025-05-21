import { configureStore } from '@reduxjs/toolkit';
import { tripApi } from '../../services/tripApi';
import { Trip, TripFilterResponse, TripQuery, TripResponse } from '../../types/user/tripTypes';
import { getValidToken } from '../../utils/authUtils';
import { HttpStatusCode } from 'axios';

jest.mock('../../utils/authUtils', () => ({
  getValidToken: jest.fn(),
}));

const mockGetValidToken = getValidToken as jest.Mock;

describe('tripApi', () => {
  let store: any;

  const mockTrip: Trip = {
    _id: 'trip1',
    operator_id: 'operator1',
    bus_id: {
      _id: 'bus1',
      operator_id: 'operator1',
      busNumber: 'BUS123',
      busType: 'AC',
      totalSeats: 40,
      amenities: ['WiFi', 'AC', 'TV'],
    },
    source: 'City A',
    destination: 'City B',
    departure_time: '2023-01-01T08:00:00Z',
    arrival_time: '2023-01-01T12:00:00Z',
    price: 500,
    total_seats: 40,
    available_seats: [1, 2, 3, 4, 5],
    booked_seats: [6, 7, 8],
    status: 'scheduled',
  };

  const mockFilterResponse: TripFilterResponse = {
    status: HttpStatusCode.Ok,
    success: true,
    message: 'Trips found',
    data: [mockTrip],
  };

  const mockTripResponse: TripResponse = {
    status: HttpStatusCode.Ok,
    success: true,
    message: 'Trip found',
    data: mockTrip,
  };

  beforeAll(() => {
    store = configureStore({
      reducer: {
        [tripApi.reducerPath]: tripApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tripApi.middleware),
    });

    global.fetch = jest.fn() as jest.Mock;
  });

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    mockGetValidToken.mockClear();
  });

  describe('getTripsByFilter', () => {
    it('should make a POST request with the correct parameters and headers', async () => {
      const filter: TripQuery = {
        source: 'City A',
        destination: 'City B',
        seats: 2,
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFilterResponse),
        })
      );

      mockGetValidToken.mockReturnValue('mock-token');

      await store.dispatch(tripApi.endpoints.getTripsByFilter.initiate(filter));

      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      
      expect(fetchCall.url).toBe('http://localhost:8000/api/user/trip');
      expect(fetchCall.method).toBe('POST');
      
      expect(fetchCall.headers.get('Authorization')).toBe('Bearer mock-token');
      expect(fetchCall.headers.get('Content-Type')).toBe('application/json');
      
      const body = await fetchCall.json();
      expect(body).toEqual(filter);
    });
  });

  describe('getTripById', () => {
    it('should make a GET request with the correct URL and headers', async () => {
      const trip_id = 'trip1';

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTripResponse),
        })
      );

      mockGetValidToken.mockReturnValue('mock-token');

      await store.dispatch(tripApi.endpoints.getTripById.initiate({ trip_id }));

      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0];
      
      expect(fetchCall.url).toBe('http://localhost:8000/api/user/trip/trip1');
      expect(fetchCall.method).toBe('GET');
      
      expect(fetchCall.headers.get('Authorization')).toBe('Bearer mock-token');
    });
  });
});