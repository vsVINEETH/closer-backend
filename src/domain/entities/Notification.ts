export class Notification {
        public id: string;
        public user: string;
        public interactor: string;
        public type: string;
        public message: string;
        public createdAt?: string;
    constructor(
        props:{
         id: string,
         user: string, 
         interactor: string,
         type: string,
         message: string,
         createdAt?: string,
        }
    ) {
        this.id = props.id,
        this.user = props.user,
        this.interactor = props.interactor,
        this.type = props.type,
        this.message = props.message,
        this.createdAt = props.createdAt
    }
  };
