import { injectable } from "inversify";
import { ISMSLibrary } from "../interfaces/ISMSLibrary";
import { AppError } from "../utils/AppError";



@injectable()
export class SMSService implements ISMSLibrary {
    private readonly apiKey: string;
    private readonly senderId: string;
    private readonly apiUrlBulky: string;
    private readonly shortCode: string;
    private readonly apiUrlSingle: string;

    constructor() {
        this.apiKey = process.env.SMS_API_KEY || "";
        this.senderId = process.env.SMS_PARTNERID || "";
        this.apiUrlBulky = process.env.SMS_BULK_URL || "";
        this.shortCode = process.env.SMS_SHORTCODE || "";
        this.apiUrlSingle = process.env.SMS_URL || "";

        if (!this.apiKey || !this.senderId || !this.apiUrlBulky || !this.shortCode || !this.apiUrlSingle) {
            throw new AppError("SMS configuration is missing", 500);
        }
    }

    private getHeaders(): Headers {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        return headers;
    }

    async sendBulky(to: any, message: string): Promise<any> {
        try {


            if (!to.length) {
                throw new AppError("We could not get phone from your query, ensure phone numbers exist in the contact groups")
            }

            let count: number = to.length
            const smslist: { apikey: string, partnerID: string, message: string, shortcode: string, mobile: string }[] = [];

            for (const phone of to) {
                smslist.push({
                    apikey: this.apiKey,
                    partnerID: this.senderId,
                    message,
                    shortcode: this.shortCode,
                    mobile: phone,
                });
            }



            const payload = {
                count,
                smslist,
            };

            console.log(payload)


            const requestOptions = {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            };

            const response = await fetch(this.apiUrlBulky, requestOptions);
            if (!response.ok) {
                throw new Error(`Failed to send bulky SMS. Status: ${response.status}`);
            }

            //console.log(await response.json())

            const result = await response.json();
            return result;
        } catch (error) {
            throw new AppError("Failed to send bulky SMS: " + error, 500);
        }
    }

    async sendSingle(to: string, message: string): Promise<any> {
        try {
            const payload = {
                apikey: this.apiKey,
                partnerID: this.senderId,
                shortcode: this.shortCode,
                mobile: to,
                message: message,
            };

            const requestOptions = {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            };

            const response = await fetch(this.apiUrlSingle, requestOptions);

            if (!response.ok) {
                throw new Error(`Failed to send single SMS. Status: ${response.status}`);
            }

            const result = await response.json();

            console.log(result.responses);
            return result.responses;
        } catch (error) {
            throw new AppError("Failed to send single SMS: " + error, 500);
        }
    }
}
