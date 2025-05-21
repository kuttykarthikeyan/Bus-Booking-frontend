import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingCard from "../BookingCard";
import { useHistoryQuery, useCancelSeatsMutation } from "../../services/bookingApi";
import { BookedTrip } from "../../types/bookingTypes";
import { act } from "react";

jest.mock("../../services/bookingApi");

const mockUseHistoryQuery = useHistoryQuery as jest.Mock;
const mockUseCancelSeatsMutation = useCancelSeatsMutation as jest.Mock;

const generateTrip = (overrides?: Partial<BookedTrip>): BookedTrip => ({
  _id: "booking1234",
  booking_status: "confirmed",
  payment_status: "completed",
  seat_numbers: [1, 2, 3],
  trip_id: {
    _id: "trip1234",
    source: "A",
    destination: "B",
    price: 100,
    departure_time: new Date().toISOString(),
    arrival_time: new Date(Date.now() + 3600000).toISOString(),
  },
  ...overrides,
});
const cancelMock = jest.fn().mockReturnValue({
  unwrap: () => Promise.resolve({ message: "Seats cancelled successfully" }),
});

describe("BookingCard Component - Additional Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCancelSeatsMutation.mockReturnValue([jest.fn(), { isLoading: false }]);
  });
    
  test("shows cancellation in progress state", () => {
    const mockTrip = generateTrip();
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });
    

    mockUseCancelSeatsMutation.mockReturnValue([jest.fn(), { isLoading: true }]);

    render(<BookingCard />);
    fireEvent.click(screen.getByTestId("toggle-cancel-options"));
    fireEvent.click(screen.getByTestId("seat-button-1"));

    expect(screen.getByTestId("cancellation-in-progress")).toBeInTheDocument();
    expect(screen.getByTestId("cancellation-in-progress")).toHaveTextContent(
      "Processing..."
    );
  });
  test("shows success alert when seats are cancelled successfully", async () => {
  const mockTrip = generateTrip();
  const cancelMock = jest.fn().mockResolvedValue({ 
    data: { 
      message: "Seats cancelled successfully",
    } 
  });

  mockUseHistoryQuery.mockReturnValue({
    data: { 
      data: { 
        bookedTrips: [mockTrip], 
        canceledTrips: [] 
      } 
    },
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  });

  mockUseCancelSeatsMutation.mockReturnValue([
    cancelMock, 
    { 
      isLoading: false,
    }
  ]);

  render(<BookingCard />);
  
  fireEvent.click(screen.getByTestId("toggle-cancel-options"));
  fireEvent.click(screen.getByTestId("seat-button-1"));
  
  fireEvent.click(screen.getByTestId("confirm-cancellation"));

  await waitFor(() => {
    const alert = screen.getByTestId("alert-message");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Seats cancelled successfully");
    expect(alert).toHaveClass("bg-green-100");
  });

  // Verify the mock was called correctly
  expect(cancelMock).toHaveBeenCalledWith({
    booking_id: "booking1234",
    seat_numbers: [1],
  });
});

  test("hides success alert after 5 seconds", async () => {
  jest.useFakeTimers();

  const mockTrip = generateTrip();

  const cancelMock = jest.fn().mockReturnValue({
    unwrap: () => Promise.resolve({ message: "Seats cancelled successfully" }),
  });

  mockUseHistoryQuery.mockReturnValue({
    data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
    isLoading: false,
    isError: false,
  });

  mockUseCancelSeatsMutation.mockReturnValue([cancelMock, { isLoading: false }]);

  render(<BookingCard />);

  fireEvent.click(screen.getByTestId("toggle-cancel-options"));
  fireEvent.click(screen.getByTestId("seat-button-1"));
  fireEvent.click(screen.getByTestId("confirm-cancellation"));

  await waitFor(() => {
    expect(screen.getByTestId("alert-message")).toBeInTheDocument();
    expect(screen.getByTestId("alert-message")).toHaveTextContent("Seats cancelled successfully");
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });

  await waitFor(() => {
    expect(screen.queryByTestId("alert-message")).not.toBeInTheDocument();
  });

  jest.useRealTimers();
});



  test("disables cancel button when no seats selected", () => {
    const mockTrip = generateTrip();
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    fireEvent.click(screen.getByTestId("toggle-cancel-options"));

    const cancelBtn = screen.getByTestId("confirm-cancellation");
    expect(cancelBtn).toBeDisabled();
    expect(cancelBtn).toHaveClass("cursor-not-allowed");
  });

  test("toggles seat selection correctly", () => {
    const mockTrip = generateTrip();
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    fireEvent.click(screen.getByTestId("toggle-cancel-options"));

    const seatBtn = screen.getByTestId("seat-button-1");
    fireEvent.click(seatBtn);
    expect(seatBtn).toHaveClass("bg-red-500");

    fireEvent.click(seatBtn);
    expect(seatBtn).not.toHaveClass("bg-red-500");
  });

  test("shows correct payment status styling", () => {
    const mockTrip = generateTrip({ payment_status: "pending" });
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    const paymentStatus = screen.getByText("pending");
    expect(paymentStatus).toHaveClass("text-amber-600");
  });

  test("shows refunded payment status styling", () => {
    const mockTrip = generateTrip({ payment_status: "refunded" });
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    const paymentStatus = screen.getByText("refunded");
    expect(paymentStatus).toHaveClass("text-blue-600");
  });

  test("shows loading state", () => {
    mockUseHistoryQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<BookingCard />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });
  test("allows cancelling multiple selected seats", async () => {
  const mockTrip = generateTrip();
  const cancelMock = jest.fn().mockResolvedValue({ data: { message: "Seats cancelled successfully" } });


  mockUseHistoryQuery.mockReturnValue({
    data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
    isLoading: false,
    isError: false,
  });

  mockUseCancelSeatsMutation.mockReturnValue([cancelMock, { isLoading: false }]);

  render(<BookingCard />);
  fireEvent.click(screen.getByTestId("toggle-cancel-options"));

  fireEvent.click(screen.getByTestId("seat-button-1"));
  fireEvent.click(screen.getByTestId("seat-button-2"));

  fireEvent.click(screen.getByTestId("confirm-cancellation"));

  await waitFor(() => {
    expect(cancelMock).toHaveBeenCalledWith({
      booking_id: "booking1234",
      seat_numbers: [1, 2],
    });
  });
});


  test("shows error state", () => {
    mockUseHistoryQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<BookingCard />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
  });

  test("shows empty state if no bookings", () => {
    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [], canceledTrips: [] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  test("renders booked trip and allows seat selection and cancellation", async () => {
  const mockTrip = generateTrip();
  const cancelMock = jest.fn().mockResolvedValue({ data: { message: "Seats cancelled successfully" } });


  mockUseHistoryQuery.mockReturnValue({
    data: { data: { bookedTrips: [mockTrip], canceledTrips: [] } },
    isLoading: false,
    isError: false,
  });

  mockUseCancelSeatsMutation.mockReturnValue([cancelMock, { isLoading: false }]);

  render(<BookingCard />);
  // rest of test ...


    expect(screen.getByTestId("booked-trip")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("toggle-cancel-options"));

    const seatBtn = screen.getByTestId("seat-button-1");
    fireEvent.click(seatBtn);

    const cancelBtn = screen.getByTestId("confirm-cancellation");
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(cancelMock).toHaveBeenCalledWith({
        booking_id: "booking1234",
        seat_numbers: [1],
      });
    });

    expect(await screen.findByTestId("alert-message"));
  });


  test("displays canceled trips", () => {
    const canceledTrip = generateTrip({
      booking_status: "cancelled",
      seat_numbers: [4, 5],
    });

    mockUseHistoryQuery.mockReturnValue({
      data: { data: { bookedTrips: [], canceledTrips: [canceledTrip] } },
      isLoading: false,
      isError: false,
    });

    render(<BookingCard />);
    expect(screen.getByTestId("cancelled-trips")).toBeInTheDocument();
    expect(screen.getByTestId("cancelled-trip")).toHaveTextContent("Booking Canceled");
  });
});
