export class Admin{
    public id: string;
    public email: string;
    public password: string;

    constructor(props:{id: string, email:string, password: string}){
        this.id = props.id,
        this.email = props.email,
        this.password = props.password 
    };
};