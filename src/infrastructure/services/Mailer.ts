import { IMailer } from "../../usecases/interfaces/IMailer";
import nodemailer from 'nodemailer';
import { ContentDTO } from "../../usecases/dtos/ContentDTO";
import { EventDTO } from "../../usecases/dtos/EventDTO";

export class Mailer implements IMailer {

    async SendEmail(to: string, subject: string, htmlContent: string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_ID,
                pass: process.env.SMTP_KEY
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_ID,
            to:`${to}`,
            subject: `${subject}`,
            // text: `Your OTP for verification is: ${subject}`,
            html: `${htmlContent}`,
        })

        return true;
    }


    generateOtpEmailContent(otp: string): string {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9; text-align: center;">
            <h2 style="color: #333;">🔐 Your OTP for Verification</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Please use the following One-Time Password (OTP) to verify your account:
            </p>
    
            <div style="display: inline-block; background: #eef2ff; padding: 15px 25px; border-radius: 6px; font-size: 24px; font-weight: bold; color: #333; letter-spacing: 2px; margin: 15px 0;">
                ${otp}
            </div>
    
            <p style="color: #d9534f; font-size: 14px; font-weight: bold; margin-top: 10px;">
                ⚠ This OTP is valid for a limited time. Do not share it with anyone.
            </p>
    
            <p style="text-align: center; font-size: 12px; color: #777; margin-top: 15px;">
                If you did not request this, please ignore this email.
            </p>
        </div>
        `;
    }
    

    // Template for employee joining credentials email
    generateCredentialsEmailContent(username: string, password: string): string {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">🎉 Welcome to the Company!</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
                <p style="color: #555; font-size: 16px; line-height: 1.6;">Your login credentials are as follows:</p>
    
                <div style="background: #eef2ff; padding: 10px; border-radius: 5px; display: inline-block; margin: 10px auto;">
                    <p style="margin: 5px 0; font-size: 14px; color: #333;"><strong>Username:</strong> ${username}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #333;"><strong>Password:</strong> ${password}</p>
                </div>
    
                <p style="color: #d9534f; font-size: 14px; margin-top: 10px;"><strong>⚠ Please change your password after your first login for security.</strong></p>
    
                <p style="margin-top: 15px;">
                    <a href="[Your Login URL]" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        🔑 Login Now
                    </a>
                </p>
            </div>
    
            <p style="text-align: center; font-size: 12px; color: #777; margin-top: 15px;">
                If you have any issues, please contact support. Welcome aboard! 🚀
            </p>
        </div>
        `;
    }
    

    generateNewContentNotifyEmail(content: ContentDTO) {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">📢 New Content Alert! 🚀</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
                <h3 style="color: #007bff; margin-bottom: 5px;">${content.title}</h3>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">${content.subtitle}</p>

            </div>
    
            <p style="text-align: center; font-size: 12px; color: #777; margin-top: 15px;">
                Stay updated with the latest content. Happy reading! ✨
            </p>
        </div>
        `;
    }    

    generateNewEventNotifyEmail(event: EventDTO) {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">🎊 Exciting News! A New Event is Here! 🎊</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
                <h3 style="color: #007bff; margin-bottom: 5px;">${event.title}</h3>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">${event.description}</p>
    
                <p style="margin: 15px 0;">
                    <a href="${event.locationURL}" style="display: inline-block; background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        🔥 Check it Out!
                    </a>
                </p>
            </div>
    
            <p style="text-align: center; font-size: 12px; color: #777; margin-top: 15px;">
                Don't miss out! Join us for an amazing experience. 🎉
            </p>
        </div>
        `;
    }
    

    generateEventReceiptEmail(event: EventDTO): string {
        return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">🎉 Warm Welcome..! Join and Have Fun! 🎉</h2>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #007bff; margin-bottom: 5px;">${event.title}</h3>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">${event.description}</p>
    
                <p style="color: #444; font-weight: bold; margin: 10px 0 5px;">📍 Venue:</p>
                <p style="color: #666; font-size: 14px;">${event.location}</p>
    
                <p style="text-align: center; margin-top: 15px;">
                    <a href="${event.locationURL}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                        📍 View Location
                    </a>
                </p>
            </div>
    
            <p style="text-align: center; font-size: 12px; color: #777; margin-top: 15px;">
                Thank you for choosing our event! We can't wait to see you there. 🎊
            </p>
        </div>
        `; 
    }
    
}