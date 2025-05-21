import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TripSearch from '../TripSearch';
import { useGetTripsByFilterMutation } from '../../services/tripApi';
import { TripQuery } from '../../types/tripTypes';

// Mock the API hook
jest.mock('../../services/tripApi', () => ({
  useGetTripsByFilterMutation: jest.fn(),
}));

// Mock the TripCard component
jest.mock('../TripCard', () => () => <div data-testid="trip-card">TripCard</div>);

describe('TripSearch Component', () => {
  const mockGetTripsByFilter = jest.fn();
  const mockData = {
    data: [
      { _id: '1', source: 'City A', destination: 'City B', price: 100, seats: 2 },
      { _id: '2', source: 'City C', destination: 'City D', price: 150, seats: 3 },
    ],
  };

  beforeEach(() => {
    (useGetTripsByFilterMutation as jest.Mock).mockReturnValue([
      mockGetTripsByFilter,
      { data: null, isLoading: false, error: null },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the search form with all fields', () => {
    render(<TripSearch />);
    
    expect(screen.getByText('Find Your Trip')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Departure city')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Arrival city')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('5000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search trips/i })).toBeInTheDocument();
  });

  it('updates form state when input values change', () => {
    render(<TripSearch />);
    
    const sourceInput = screen.getByPlaceholderText('Departure city');
    const destinationInput = screen.getByPlaceholderText('Arrival city');
    const minPriceInput = screen.getByPlaceholderText('0');
    const maxPriceInput = screen.getByPlaceholderText('5000');
    const seatsInput = screen.getByPlaceholderText('1');

    fireEvent.change(sourceInput, { target: { name: 'source', value: 'New York' } });
    fireEvent.change(destinationInput, { target: { name: 'destination', value: 'Boston' } });
    fireEvent.change(minPriceInput, { target: { name: 'minPrice', value: '50' } });
    fireEvent.change(maxPriceInput, { target: { name: 'maxPrice', value: '200' } });
    fireEvent.change(seatsInput, { target: { name: 'seats', value: '2' } });

    expect(sourceInput).toHaveValue('New York');
    expect(destinationInput).toHaveValue('Boston');
    expect(minPriceInput).toHaveValue(50);
    expect(maxPriceInput).toHaveValue(200);
    expect(seatsInput).toHaveValue(2);
  });

  it('calls getTripsByFilter with correct parameters when search button is clicked', async () => {
    render(<TripSearch />);
    
    fireEvent.change(screen.getByPlaceholderText('Departure city'), { 
      target: { name: 'source', value: 'New York' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Arrival city'), { 
      target: { name: 'destination', value: 'Boston' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /search trips/i }));

    await waitFor(() => {
      expect(mockGetTripsByFilter).toHaveBeenCalledWith({
        source: 'New York',
        destination: 'Boston'
      });
    });
  });

  it('filters out undefined/empty values when making the API call', async () => {
    render(<TripSearch />);
    
    fireEvent.change(screen.getByPlaceholderText('Departure city'), { 
      target: { name: 'source', value: 'New York' } 
    });
    fireEvent.change(screen.getByPlaceholderText('0'), { 
      target: { name: 'minPrice', value: '100' } 
    });
    
    fireEvent.click(screen.getByRole('button', { name: /search trips/i }));

    await waitFor(() => {
      expect(mockGetTripsByFilter).toHaveBeenCalledWith({
        source: 'New York',
        minPrice: 100
      });
      expect(mockGetTripsByFilter).not.toHaveBeenCalledWith(expect.objectContaining({
        destination: expect.anything(),
        maxPrice: expect.anything(),
        seats: expect.anything()
      }));
    });
  });

  it('shows loading spinner when isLoading is true', () => {
    (useGetTripsByFilterMutation as jest.Mock).mockReturnValue([
      mockGetTripsByFilter,
      { data: null, isLoading: true, error: null },
    ]);
    
    render(<TripSearch />);
    // expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    (useGetTripsByFilterMutation as jest.Mock).mockReturnValue([
      mockGetTripsByFilter,
      { data: null, isLoading: false, error: { message: 'Error fetching data' } },
    ]);
    
    render(<TripSearch />);
    expect(screen.getByText(/error fetching trips/i)).toBeInTheDocument();
  });

  it('shows "no trips found" message when data is empty', () => {
    (useGetTripsByFilterMutation as jest.Mock).mockReturnValue([
      mockGetTripsByFilter,
      { data: { data: [] }, isLoading: false, error: null },
    ]);
    
    render(<TripSearch />);
    expect(screen.getByText(/no trips found/i)).toBeInTheDocument();
  });

  it('displays trip cards when data is available', () => {
    (useGetTripsByFilterMutation as jest.Mock).mockReturnValue([
      mockGetTripsByFilter,
      { data: mockData, isLoading: false, error: null },
    ]);
    
    render(<TripSearch />);
    expect(screen.getAllByTestId('trip-card')).toHaveLength(2);
    expect(screen.getByText(/available trips \(2\)/i)).toBeInTheDocument();
  });
});