export interface BookingData{

    trip_id:string;
    seat_numbers:number[]
}

export interface BookingResponse {
    status: number;
    success: boolean;
    message: string;
    data: {
      booking_id: string;
    };
  }
  export interface BookingData {
    trip_id: string;
    seat_numbers: number[];
  }

  export interface Trip {
    _id: string;
    source: string;
    destination: string;
    departure_time: string; 
    arrival_time: string;  
    price: number;
  }
  
  export interface BookedTrip {
    _id: string;
    trip_id: Trip;
    seat_numbers: number[];
    payment_status: string;
    booking_status: string;
  }
  
  export interface UserTripHistoryResponse {
    status: number;
    success: boolean;
    message: string;
    data: {
      bookedTrips: BookedTrip[];
      canceledTrips: any[]; 
    };
  }

export interface UserCancelSeatRequest {
  seat_numbers: number[];
  booking_id: string;
}

export interface UserCancelSeatResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface AlertMessage {
  type: 'success' | 'error';
  text: string;
}