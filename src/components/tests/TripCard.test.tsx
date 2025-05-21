import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TripCard from '../TripCard';
import { Trip, Bus } from '../../types/tripTypes';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Clock: jest.fn().mockImplementation(() => <span>ClockIcon</span>),
  MapPin: jest.fn().mockImplementation(() => <span>MapPinIcon</span>),
}));

describe('TripCard Component', () => {
  const mockBus: Bus = {
    _id: 'bus123',
    operator_id: 'op123',
    busNumber: 'TN1234',
    busType: 'AC Sleeper',
    totalSeats: 40,
    amenities: ['WiFi', 'Charging Port', 'AC'],
  };

  const mockTrip: Trip = {
    _id: 'trip123',
    operator_id: 'op123',
    bus_id: mockBus,
    source: 'Chennai',
    destination: 'Bangalore',
    departure_time: '2023-06-15T08:00:00Z',
    arrival_time: '2023-06-15T14:30:00Z',
    price: 1200,
    total_seats: 40,
    available_seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    booked_seats: Array.from({ length: 25 }, (_, i) => i + 16),
    status: "scheduled",
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

it('renders trip information correctly', () => {
  render(<TripCard trip={mockTrip} />);
  
  expect(screen.getByText('AC Sleeper')).toBeInTheDocument();
  expect(screen.getByText('TN1234')).toBeInTheDocument();
  
  expect(screen.getByText('01:30 pm')).toBeInTheDocument();
  expect(screen.getByText('08:00 pm')).toBeInTheDocument();
  
  expect(screen.getByText('Chennai')).toBeInTheDocument();
  expect(screen.getByText('Bangalore')).toBeInTheDocument();
  expect(screen.getByText('6h 30m')).toBeInTheDocument();
  expect(screen.getByText('₹1200')).toBeInTheDocument();
  expect(screen.getByText('15 seats left')).toBeInTheDocument();
  expect(screen.getByText('WiFi')).toBeInTheDocument();
  expect(screen.getByText('Charging Port')).toBeInTheDocument();
  expect(screen.getByText('AC')).toBeInTheDocument();
});

it('formats the time correctly', () => {
  render(<TripCard trip={mockTrip} />);
  const timeElements = screen.getAllByText(/(\d{1,2}:\d{2} (am|pm))/i);
  expect(timeElements.length).toBe(2);
});

it('calculates duration correctly', () => {
  render(<TripCard trip={mockTrip} />);
  expect(screen.getByText('6h 30m')).toBeInTheDocument();
});

  it('navigates to booking page when "Select Seats" is clicked', () => {
    render(<TripCard trip={mockTrip} />);
    const selectSeatsButton = screen.getByText('Select Seats');
    fireEvent.click(selectSeatsButton);
    expect(mockNavigate).toHaveBeenCalledWith('/trip/booking/trip123');
  });

  it('displays the correct number of available seats', () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText('15 seats left')).toBeInTheDocument();
  });

  it('renders all amenities', () => {
    render(<TripCard trip={mockTrip} />);
    mockTrip.bus_id.amenities.forEach(amenity => {
      expect(screen.getByText(amenity)).toBeInTheDocument();
    });
  });

  it('renders the correct icons', () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getAllByText('MapPinIcon').length).toBe(2);
    expect(screen.getByText('ClockIcon')).toBeInTheDocument();
  });



  it('shows correct seat availability when few seats left', () => {
    const fewSeatsTrip = {
      ...mockTrip,
      available_seats: [1, 2, 3],
      booked_seats: Array.from({ length: 37 }, (_, i) => i + 4)
    };
    render(<TripCard trip={fewSeatsTrip} />);
    expect(screen.getByText('3 seats left')).toBeInTheDocument();
  });

  it('shows correct seat availability when no seats left', () => {
    const fullTrip = {
      ...mockTrip,
      available_seats: [],
      booked_seats: Array.from({ length: 40 }, (_, i) => i + 1)
    };
    render(<TripCard trip={fullTrip} />);
    expect(screen.getByText('0 seats left')).toBeInTheDocument();
  });
});