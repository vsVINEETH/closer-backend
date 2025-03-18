export class Notification {
    constructor(
        public id: string,
        public user: string, 
        public interactor: string,
        public type: string,
        public message: string,
        public createdAt?: string,
    ) {}
  }
