export class Sales {
    constructor(
           public userId: string,
           public saleType: string,
           public billedAmount: number,
           public subscriptionId?:string,
           public planType?: string,
           public eventId?: string,
           public bookedSlots?: number,
    ){}
}