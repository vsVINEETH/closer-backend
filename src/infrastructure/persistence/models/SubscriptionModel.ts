import mongoose, {Schema} from "mongoose";
import { ISubscriptionDocument } from "../interfaces/ISubscription";

const subscriptionSchema: Schema = new Schema({
    planType: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly'], 
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      isListed: {
        type: Boolean,
        default: true
      }
}, { timestamps: true });

export const SubscriptionModel = mongoose.model<ISubscriptionDocument>('Subscription', subscriptionSchema);

export const initializeSubscriptionPlans = async () => {
    const plans = [
      { planType: 'weekly', price: 99 },
      { planType: 'monthly', price: 396},
      { planType: 'yearly', price: 4752 },
    ];
  
    for (const plan of plans) {
      const existingPlan = await SubscriptionModel.findOne({ planType: plan.planType });
      if (!existingPlan) {
        await SubscriptionModel.create(plan);
      }
    }
  
    console.log('Subscription plans initialized');
  };
  
  //initializeSubscriptionPlans().catch(console.error);