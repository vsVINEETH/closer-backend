export class Category {
        public id: string;
        public name : string;
        public isListed: boolean;
        public createdAt: string;

        constructor(
            props:{id: string, name: string, isListed: boolean, createdAt: string}
        ){
            this.id = props.id;
            this.name = props.name;
            this.isListed = props.isListed;
            this.createdAt = props.createdAt;
        }
};