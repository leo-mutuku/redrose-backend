import { NextFunction, Request, Response } from "express";
import { ISMSInteractor } from "../interfaces/ISMSInteractor";
import { INTERFACE_TYPE } from "../utils";
import { injectable, inject } from "inversify";

@injectable()
export class SMSController {
    private readonly smsInteractor: ISMSInteractor;
    constructor(@inject(INTERFACE_TYPE.SMSInteractor) smsInteractor: ISMSInteractor) {
        this.smsInteractor = smsInteractor;
    }
    async sendBulky(req: Request, res: Response, next: NextFunction) {
        try {
            const { to, message } = req.body;
            await this.smsInteractor.sendBulky(to, message);
        } catch (error) {
            throw error;
        }
    }

    async sendSingle(req: Request, res: Response, next: NextFunction) {
        try {

            const { to, message } = req.body;
            await this.smsInteractor.sendSingle(to, message);
            return res.status(200).json({
                message: "SMS sent successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}