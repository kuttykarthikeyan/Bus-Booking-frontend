export interface TripQuery{
    source?:string,
    destination?:string,
    minPrice?:number,
    maxPrice?:number,
    seats?:number
}
export interface TripFilterResponse {
    status: number;
    success: boolean;
    message: string;
    data: Trip[];
  }
  
export interface TripResponse{
  status: number;
  success: boolean;
  message: string;
  data: Trip;
}
  export interface Trip {
    _id: string;
    operator_id: string;
    bus_id: Bus;
    source: string;
    destination: string;
    departure_time: string; 
    arrival_time: string;    
    price: number;
    total_seats: number;
    available_seats: number[];
    booked_seats: number[];
    status: "scheduled" | "cancelled" | "completed";
  }
  
  export interface Bus {
    _id: string;
    operator_id: string;
    busNumber: string;
    busType: string;
    totalSeats: number;
    amenities: string[];
  
  }
