import Razorpay from "razorpay";
import { IRazorpay } from "../../usecases/interfaces/IRazorpay";
import dotenv from 'dotenv';
dotenv.config();

export class RazorpayService implements IRazorpay {
  private instance: Razorpay;

  constructor() {
    this.instance = new Razorpay({
      key_id: `${process.env.PAYMENT_KEY_ID}`,
      key_secret: `${process.env.PAYMENT_KEY_SECRET}`,
    });
  }

  async createOrder(amount: number, currency: string): Promise<any> {
    const options = {
      amount: amount * 100,
      currency,
    };
    return this.instance.orders.create(options);
  }

  async verifyPayment(data: any): Promise<boolean> {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", `${process.env.PAYMENT_KEY_SECRET}`)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");

    if (hash === data.signature) {
      console.log("Payment verified successfully!");
      return true;
    } else {
      console.error("Payment verification failed!");
      return false;
    }
  }
}
