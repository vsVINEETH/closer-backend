export class Advertisement {
    constructor(
        public id: string,
        public title: string,
        public subtitle: string,
        public content: string,
        public image: string[] | File[],
        public isListed: boolean,
        public createdAt: string,
    ){};
}