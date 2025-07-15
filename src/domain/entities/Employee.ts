export class Employee {

        public id: string;
        public name: string;
        public email: string;
        public password: string;
        public isBlocked: boolean;
        public createdAt?: string;

    constructor(
        props:{
         id: string,
         name: string,
         email: string,
         password: string,
         isBlocked: boolean,
         createdAt?: string,
        }

    ){
        this.id = props.id,
        this.name = props.name,
        this.email = props.email,
        this.password = props.password,
        this.isBlocked = props.isBlocked,
        this.createdAt = props.createdAt
    }
};