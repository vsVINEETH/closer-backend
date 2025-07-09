import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletDTO, RazorpayWalletPaymentData } from "../../dtos/WalletDTO";
import { IRazorpay } from "../../interfaces/IRazorpay";
import { toDTO, toEntity } from "../../mappers/WalletMapper";

export class WalletManagement {
    constructor(
        private walletRepository: IWalletRepository,
        private razorpay: IRazorpay
    ) { }

     async transactionCreator(userId: string, amount: number,description: string, paymentType: string ): Promise<WalletDTO | null>{
        const wallet = await this.walletRepository.findOne(userId);

        if(!wallet) return null;
        const walletEntity = toEntity(wallet);

        if(!walletEntity) return null;
        const walletData = toDTO(walletEntity);

        if(paymentType === 'credit'){
            const convertedAmount = amount / 100;

            walletData.balance += convertedAmount;

            const transaction = {
                amount: convertedAmount,
                description,
                paymentType: 'credit',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            walletData.transactions.push(transaction);
        } else if (paymentType === 'debit'){
            walletData.balance -= amount;

            const transaction = {
                amount,
                description,
                paymentType: 'debit',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            walletData.transactions.push(transaction);
        }

        return walletData;
    }


    async fetchData(userId: string): Promise<WalletDTO | null > {
        try {
            const data = await this.walletRepository.findById(userId);

            if (data === null) {
               await this.walletRepository.create(userId)
            }else{
                const walletEntity = toEntity(data);
                 if(walletEntity === null) return null;
                 const walletData = toDTO(walletEntity);
                 return walletData;
            };

            return null;
        } catch (error) {
            throw new Error('something happend in fetchData')
        }
    };

    async createOrder(paymentOrderData: {amount: number, currency: string}): Promise<boolean | null> {
        try {
            const { amount, currency } = paymentOrderData;
            return await this.razorpay.createOrder(amount, currency);
        } catch (error) {
            throw new Error('something happend in createOrder')
        }

    }

    async verifyPayment(razorpayWalletPaymentData: RazorpayWalletPaymentData): Promise<WalletDTO | null> {
        try {
            const { razorpay_order_id, razorpay_payment_id, 
                   razorpay_signature, userId, amount, description 
                  } = razorpayWalletPaymentData;

            const isValid = await this.razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!isValid) { return null }
            const walletData = await this.transactionCreator(userId,amount,description, 'credit');
       
            if(walletData === null) return null;
            
            const result = await this.walletRepository.addMoney(userId, walletData);
            if (!result) { return null }
            
            const walletEntity = toEntity(result);
            if(walletEntity === null) return null;
            const wallet = toDTO(walletEntity);
            return wallet;

        } catch (error) {
            throw new Error('something happend in verifyPayment')
        }

    }

    async payWithWallet(userId: string, amount: number , description: string): Promise<WalletDTO | null> {
        try {
            const walletData = await this.walletRepository.findById(userId);
            if (!walletData) { return null }
            if (walletData?.balance < amount) {
                return null
            } else {
                const walletData = await this.transactionCreator(userId,amount,description, 'debit');

                if(walletData === null) return null;
                const walletLatestData = await this.walletRepository.debitMoney(userId, walletData);

                if(walletLatestData === null) return null;
                const walletEntity = toEntity(walletLatestData);

                if(walletEntity === null) return null;
                const wallet = toDTO(walletEntity);
                return wallet;
            }
        } catch (error) {
            throw new Error('something happend in payWithWallet')
        }
    }

    
}