// export class Sales {
//     constructor(
//            public userId: string,
//            public saleType: string,
//            public billedAmount: number,
//            public subscriptionId?:string,
//            public planType?: string,
//            public eventId?: string,
//            public bookedSlots?: number,
//     ){}
// }


export class Sales {
           public userId: string;
           public saleType: string;
           public billedAmount: number;
           public subscriptionId?:string;
           public planType?: string;
           public eventId?: string;
           public bookedSlots?: number;

    constructor(
        props:{
            userId: string,
            saleType: string,
            billedAmount: number,
            subscriptionId?:string,
            planType?: string,
            eventId?: string,
            bookedSlots?: number,
        }

    ){
        this.userId = props.userId,
        this.saleType = props.saleType,
        this.billedAmount = props.billedAmount,
        this.subscriptionId = props.subscriptionId,
        this.planType = props.planType,
        this.eventId = props.eventId,
        this.bookedSlots = props.bookedSlots
    }
}