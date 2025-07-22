import { Types } from "../../../types/express";

export class Content {
        public id: string;
        public title: string;
        public subtitle: string;
        public content: string;
        public image: string[] | File[];
        public isListed: boolean;
        public createdAt: string;
        public category: Types.ObjectId;
        public upvotes: string[];
        public downvotes: string[];
        public shares: string[];
    constructor(
        props:{
         id: string,
         title: string,
         subtitle: string,
         content: string,
         image: string[] | File[],
         isListed: boolean,
         createdAt: string,
         category: Types.ObjectId,
         upvotes: string[],
         downvotes: string[],
         shares: string[],
        }
    ){
         this.id = props.id;
         this.title = props.title;
         this.subtitle = props.subtitle;
         this.content = props.content;
         this.image = props.image;
         this.isListed = props.isListed;
         this.createdAt = props.createdAt;
         this.category = props.category;
         this.upvotes = props.upvotes;
         this.downvotes = props.downvotes;
         this.shares = props.shares;
    };
}