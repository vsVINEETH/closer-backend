import Razorpay from "razorpay";
import { IRazorpay } from "../../usecases/interfaces/IRazorpay";
import dotenv from 'dotenv';
dotenv.config();

export class RazorpayService implements IRazorpay {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: `${process.env.PAYMENT_KEY_ID}`,//'rzp_test_nKKuSdOgDhp5tJ',
      key_secret: `${process.env.PAYMENT_KEY_SECRET}`,//'6afc2mE0gpYtQFnPxnCNE2i8',
    });
  }

  async createOrder(amount: number, currency: string): Promise<any> {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
    };
    return this.instance.orders.create(options);
  }

  async verifyPayment(data: any): Promise<boolean> {
    // Implement verification logic
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", `${process.env.PAYMENT_KEY_SECRET}`)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");

  console.log("Generated Hash:", hash);

  if (hash === data.signature) {
    console.log("Payment verified successfully!");
    return true;
  } else {
    console.error("Payment verification failed!");
    return false;
  }
  }
}
