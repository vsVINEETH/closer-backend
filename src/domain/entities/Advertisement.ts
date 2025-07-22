export class Advertisement {
        public id: string;
        public title: string;
        public subtitle: string;
        public content: string;
        public image: string[] | File[];
        public isListed: boolean;
        public createdAt: string;

        constructor(props:{
                  id: string,
                   title: string, 
                   subtitle: string, 
                   content: string, 
                   image: string[] | File[], 
                   isListed: boolean, 
                   createdAt: string
                }){
                    this.id = props.id,
                    this.title = props.title,
                    this.subtitle = props.subtitle,
                    this.content = props.content,
                    this.image = props.image,
                    this.isListed = props.isListed,
                    this.createdAt = props.createdAt
                };
};