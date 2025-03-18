import mongoose,{ SortOrder} from "mongoose";
import { initializeSubscriptionPlans } from "../persistence/models/SubscriptionModel";
export {SortOrder}
export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_ATLAS as string);
        console.log("Connected to MongoDB successfully.");
        initializeSubscriptionPlans().catch(console.error)
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
    
};