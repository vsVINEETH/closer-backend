import { IWalletDocument } from "../persistence/interfaces/IWalletModel";

export type WalletPersistanceType = Pick<IWalletDocument, 'userId' | 'balance'| 'transactions'>