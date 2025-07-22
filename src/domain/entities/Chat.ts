export class Chat {
        public id: string;
        public sender: string;
        public receiver: string ;
        public message: string;
        public type: string;
        public isRead: boolean;
        public createdAt: string;
        public callType: string;
        public callDuration: number;
        public isMissed: boolean;
        public status: string;

        constructor(props:{
                id: string,
                sender: string,
                receiver: string,
                message: string,
                type: string,
                isRead: boolean,
                createdAt: string,
                callType: string,
                callDuration: number,
                isMissed: boolean,
                status: string,
        }){
            this.id = props.id,
            this.sender = props.sender,
            this.receiver = props.receiver,
            this.message = props.message,
            this.type = props.type,
            this.isRead = props.isRead,
            this.createdAt = props.createdAt,
            this.callType = props.callType,
            this.callDuration = props.callDuration,
            this.isMissed = props.isMissed,
            this.status = props.status
        }
};
