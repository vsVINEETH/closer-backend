
export type UpcomingEventCount = {
  upcomingEvents: number ;
}[]


export interface RazorpayEventPayment {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  userId: string;
  amount: number;
  eventId: string;
  currency: string;
  slots: number;
}

export type BookingDetails = {
  userId: string,
  amount: number;
  eventId: string;
  bookedSlots: number;
};

export interface EventDTO {
    id?: string,
    title: string,
    description: string,
    image: string[],
    location: string,
    locationURL: string,
    eventDate: string,
    createdAt?: string,
    slots:number,
    totalEntries?:number,
    price:number,
    buyers: 
            {
              userId:string,
              slotsBooked: number,
              totalPaid: number,
            }[],
          
}
export interface EditEventDTO {
    _id: string,
    title: string,
    description: string,
    image: string[],
    location: string,
    locationURL: string,
    eventDate: string,
}