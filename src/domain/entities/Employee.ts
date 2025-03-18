export class Employee {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public isBlocked: boolean,
        public createdAt?: string,
    ){}
}