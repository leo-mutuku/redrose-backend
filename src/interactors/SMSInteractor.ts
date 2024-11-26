import { injectable, inject } from "inversify";
import { ISMSInteractor } from "../interfaces/ISMSInteractor";
import { AppError } from "../utils/AppError";
import { ISMSLibrary } from "../interfaces/ISMSLibrary";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class SMSInteractor implements ISMSInteractor {
    private readonly smsService: ISMSLibrary;
    constructor(@inject(INTERFACE_TYPE.SMSExternalLibrary) smsService: ISMSLibrary) {
        this.smsService = smsService;
    }

    async sendBulky(to: string, message: string): Promise<any> {
        try {
            return await this.smsService.sendBulky(to, message);
        } catch (error) {
            throw new AppError("Failed to send SMS" + error, 500);
            // throw new AppError("Failed to send SMS" + error, 500);
        }
    }
    async sendSingle(to: string, message: string): Promise<any> {
        try {
            return await this.smsService.sendSingle(to, message);
        } catch (error) {
            throw new AppError("Failed to send SMS" + error, 500);
            // throw new AppError("Failed to send SMS" + error, 500);
        }
    }

}