export interface SalesDTO {
  id: string,
  userId: string,
  saleType: string,
  billedAmount: number,
  subscriptionId?:string,
  planType?: string,
  eventId?: string,
  bookedSlots?: number,
}


export interface RawSubscriptionData {
    _id: { month: number; planType: string };
    count: number;
    amount: number;
}


export interface EventSalesData {
    _id: { month: number };
    totalSales: number;
    soldSlots: number;
    avgSalesPerMonth: number;
}


export interface TotalMonthlySalesData {
    _id: { month: number };
    totalIncome: number;
}




export type EventSales = {
  _id: string;
  userId: string;
  eventId: {
    _id: string;
    title: string;
    description: string;
    image: string[]; // Assuming images are stored as an array of URLs
    location: string;
    locationURL: string;
    eventDate: Date;
    slots: number;
    totalEntries: number;
    price: number;
    totalSales: number;
    buyers: string[]; // Assuming buyers are stored as an array of ObjectId references
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
  saleType: string;
  billedAmount: number;
  bookedSlots: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};


export type Booking = {
  _id: string;
  userId: string;
  eventId: Event;
  saleType: "event"; // Enum or string if other types exist
  billedAmount: number;
  bookedSlots: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};


export type DailySale = {
    createdAt: string; // Assuming date is stored as a string (ISO format)
    count: number;
    billedAmount: number;
    billedSlots: number
  };
  
  export type SubscriptionSale = {
    month: string;
    planType: "monthly" | "weekly" | "yearly"; // Extendable for other plans
    count: number;
    amount: number;
    dailySales: DailySale[];
  };
  
  export type EventSale = {
    month: string;
    totalSales: number;
    soldSlots: number;
    avgSalesPerMonth: number;
    dailySales: DailySale[];
  };
  
  export type MonthlySalesSummary = {
    month: string;
    totalIncome: number;
  };
  
 export type SalesReport = {
    subscriptionSales: SubscriptionSale[];
    eventSales: EventSale[];
    totalMonthlySales: MonthlySalesSummary[];
  };


   export type SalesReportDTO = {
    subscriptionSales: SubscriptionSale[];
    eventSales: EventSale[];
    totalMonthlySales: MonthlySalesSummary[];
  };
  
  


  export type DailySaleIterate = {
    createdAt: string; // Assuming it's a date string (ISO format)
    billedAmount: number;
    bookedSlots?: number; // Only applicable for event sales
  };
  
  export type SubscriptionSaleIterate = {
    _id: { month: number; planType: "monthly" | "weekly" | "yearly" }; // Adjustable for more plans
    count: number;
    amount: number;
    dailySales: DailySale[];
  };
  
  export type EventSaleIterate = {
    _id: { month: number };
    totalSales: number;
    soldSlots: number;
    avgSalesPerMonth: number;
    dailySales: DailySale[];
  };
  
  export type TotalMonthlySaleIterate = {
    _id: { month: number };
    totalIncome: number;
  };
  
  export type SalesResult = {
    subscriptionSales: SubscriptionSale[];
    eventSales: EventSalesData[];
    totalMonthlySales: TotalMonthlySalesData[];
  };
  