import { Types } from "../../../types/express";

export class Content {
    constructor(
        public id: string,
        public title: string,
        public subtitle: string,
        public content: string,
        public image: string[] | File[],
        public isListed: boolean,
        public createdAt: string,
        public category: Types.ObjectId,
        public upvotes: string[],
        public downvotes: string[],
        public shares: string[],
    ){};
}