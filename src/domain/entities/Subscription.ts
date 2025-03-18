export class Subscription {
    constructor(
        public id:string,
        public planType: string,
        public price: number,
        public isListed: boolean,
        public createdAt: string,
    ){}
}