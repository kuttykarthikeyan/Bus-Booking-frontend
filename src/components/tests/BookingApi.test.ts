import { configureStore } from '@reduxjs/toolkit';
import { bookingApi } from '../../services/bookingApi';
import { getValidToken } from '../../utils/authUtils';
import {
  BookingResponse,
  UserTripHistoryResponse,
} from '../../types/bookingTypes';

const mockGetValidToken = getValidToken as jest.MockedFunction<typeof getValidToken>;
jest.mock('../../utils/authUtils', () => ({
  getValidToken: jest.fn(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const createMockResponse = (data: any) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
  clone: () => createMockResponse(data),
});

describe('bookingApi', () => {
  const store = configureStore({
    reducer: {
      [bookingApi.reducerPath]: bookingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(bookingApi.middleware),
  });

  beforeEach(() => {
    mockFetch.mockClear();
    jest.clearAllMocks();
    mockGetValidToken.mockReturnValue('mock-token');
  });

  it('should have the correct reducerPath', () => {
    expect(bookingApi.reducerPath).toBe('bookingApi');
  });

  describe('endpoints', () => {
    it('bookSeats mutation should send correct request', async () => {
      const mockResponse: BookingResponse = {
        status: 200,
        success: true,
        message: 'Booking successful',
        data: {
          booking_id: 'booking123',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const bookingData = {
        trip_id: 'trip123',
        seat_numbers: [1, 2],
      };

      const result = store.dispatch(
        bookingApi.endpoints.bookSeats.initiate(bookingData)
      );

      await expect(result).resolves.toEqual(
        expect.objectContaining({
          data: mockResponse,
        //   status: 'fulfilled',
        })
      );
      expect(mockGetValidToken).toHaveBeenCalled();
    });

    it('history query should send correct request', async () => {
      const mockHistoryResponse: UserTripHistoryResponse = {
        status: 200,
        success: true,
        message: 'History retrieved',
        data: {
          bookedTrips: [
            {
              _id: 'booked123',
              trip_id: {
                _id: 'trip123',
                source: 'City A',
                destination: 'City B',
                departure_time: '2023-01-01T10:00:00Z',
                arrival_time: '2023-01-01T12:00:00Z',
                price: 100,
              },
              seat_numbers: [1, 2],
              payment_status: 'paid',
              booking_status: 'confirmed',
            },
          ],
          canceledTrips: [],
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockHistoryResponse));

      const result = store.dispatch(bookingApi.endpoints.history.initiate());

      await expect(result).resolves.toEqual(
        expect.objectContaining({
          data: mockHistoryResponse,
        //   status: 'fulfilled',
        })
      );
      expect(mockGetValidToken).toHaveBeenCalled();
    });it('cancelSeats mutation should send correct request', async () => {
  const mockCancelResponse = {
    status: 200,
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      cancelled_booking_id: 'booking123',
    },
  };

  mockFetch.mockResolvedValueOnce(createMockResponse(mockCancelResponse));

  const cancelData = {
    booking_id: 'booking123',
    seat_numbers: [1],
  };

  const result = await store.dispatch(
    bookingApi.endpoints.cancelSeats.initiate(cancelData)
  );

  expect(result.data).toEqual(mockCancelResponse);
  expect(mockGetValidToken).toHaveBeenCalled();
});

  });
});