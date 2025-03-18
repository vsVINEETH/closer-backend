import { ContentDTO } from "../dtos/ContentDTO";
import { EventDTO } from "../dtos/EventDTO";
export interface IMailer {
    SendEmail(to: string, data: string, htmlContent: string):any;
    generateOtpEmailContent(otp: string): string;
    generateCredentialsEmailContent(username: string, password: string): string;
    generateNewContentNotifyEmail(content:ContentDTO): string;
    generateNewEventNotifyEmail(event: EventDTO): string;
    generateEventReceiptEmail(event: EventDTO | null): string,
}