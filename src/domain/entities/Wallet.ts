export interface Transaction  {
  amount: number;
  description: string;
  paymentType: string; 
  createdAt: Date;
  updatedAt: Date;
}

  
// export class Wallet {
//     constructor(
//     public id: string,
//     public userId: string,
//     public balance: number,
//     public transactions: Transaction[],
//     public createdAt: Date,
//     public updatedAt: Date,
//     ){}
// };

export class Wallet {
    public id: string;
    public userId: string;
    public balance: number;
    public transactions: Transaction[];
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
      props:{
        id: string,
        userId: string,
        balance: number,
        transactions: Transaction[],
        createdAt: Date,
        updatedAt: Date,
      }
    ){
      this.id = props.id,
      this.userId = props.userId,
      this.balance = props.balance,
      this.transactions = props.transactions,
      this.createdAt = props.createdAt,
      this.updatedAt = props.updatedAt
    }

};

