// export class Subscription {
//     constructor(
//         public id:string,
//         public planType: string,
//         public price: number,
//         public isListed: boolean,
//         public createdAt: string,
//     ){}
// };


export class Subscription {

        public id:string;
        public planType: string;
        public price: number;
        public isListed: boolean;
        public createdAt: string;

    constructor(
        props:{
         id:string,
         planType: string,
         price: number,
         isListed: boolean,
         createdAt: string,
        }
    ){
        this.id = props.id,
        this.planType = props.planType,
        this.price = props.price,
        this.isListed = props.isListed,
        this.createdAt = props.createdAt
    }
}

