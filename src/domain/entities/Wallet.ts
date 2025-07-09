export interface Transaction  {
  amount: number;
  description: string;
  paymentType: string; 
  createdAt: Date;
  updatedAt: Date;
}

  
export class Wallet {
    constructor(
    public id: string,
    public userId: string,
    public balance: number,
    public transactions: Transaction[],
    public createdAt: Date,
    public updatedAt: Date,
    ){}

}