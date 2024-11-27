import { injectable, inject } from "inversify";
import { ISMSInteractor } from "../interfaces/ISMSInteractor";
import { AppError } from "../utils/AppError";
import { ISMSLibrary } from "../interfaces/ISMSLibrary";
import { INTERFACE_TYPE } from "../utils";
import { ISMSRepository } from "../interfaces/ISMSRepository";

@injectable()
export class SMSInteractor implements ISMSInteractor {
    private readonly smsService: ISMSLibrary;
    private readonly smsRepository: ISMSRepository;

    constructor(
        @inject(INTERFACE_TYPE.SMSExternalLibrary) smsService: ISMSLibrary,
        @inject(INTERFACE_TYPE.SMSRepository) smsRepository: ISMSRepository
    ) {
        this.smsService = smsService;
        this.smsRepository = smsRepository;
    }

    async sendBulky(target: any, message: string): Promise<any> {
        try {
            const phoneNumbers = await this.smsRepository.getPhoneNumbers(target);
            console.log(phoneNumbers)
            return await this.smsService.sendBulky(phoneNumbers, message);
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