import { Document } from "mongoose";

export interface EventDocument extends Document {
     title: string,
     description: string,
     image: string[],
     location: string,
     locationURL: string,
     eventDate: string,
     slots:number,
     totalEntries:number,
     totalSales: number,
     price:number,
     buyers: {
       userId:string,
       slotsBooked: number,
       totalPaid: number,
     }[],
}