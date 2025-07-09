// import { toEntity } from "../../usecases/mappers/WalletMapper";

//     export function transactionCreator(userId: string, amount: number,description: string, paymentType: string ): Promise<WalletDTO | null>{
//         const wallet = await this.walletRepository.findOne(userId);

//         if(!wallet) return null;
//         const walletEntity = toEntity(wallet);

//         if(!walletEntity) return null;
//         const walletData = toDTO(walletEntity);

//         if(paymentType === 'credit'){
//             const convertedAmount = amount / 100;

//             walletData.balance += convertedAmount;

//             const transaction = {
//                 amount: convertedAmount,
//                 description,
//                 paymentType: 'credit',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             };

//             walletData.transactions.push(transaction);
//         } else if (paymentType === 'debit'){
//             walletData.balance -= amount;

//             const transaction = {
//                 amount,
//                 description,
//                 paymentType: 'debit',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//             };

//             walletData.transactions.push(transaction);
//         }

//         return walletData;
//     }



//     // try {
//     //   const wallet = await WalletModel.findOne({ userId: userId });
//     //   if (!wallet) {
//     //     return wallet;
//     //   }
//     //   const convertedAmount = amount / 100;

//     //   wallet.balance += convertedAmount;

//     //   const transaction = {
//     //     amount: convertedAmount,
//     //     description,
//     //     paymentType: "debit",
//     //     createdAt: new Date(),
//     //     updatedAt: new Date(),
//     //   };

//     //   wallet.transactions.push(transaction);
//     //   await wallet.save();

//     //   return {
//     //     id: wallet.id,
//     //     userId: wallet.userId.toString(),
//     //     balance: wallet.balance,
//     //     transactions: wallet.transactions,
//     //     createdAt: wallet.createdAt,
//     //   };