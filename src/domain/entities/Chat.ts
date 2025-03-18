export class Chat {
    constructor(
        public _id: string,
        public sender: string,
        public receiver: string | Object,
        public message: string,
        public type: string,
        public isRead: boolean,
        public createdAt: string,
        public callType: string,
        public callDuration: number,
        public isMissed: boolean,
        public status: string,
    ){}
}
