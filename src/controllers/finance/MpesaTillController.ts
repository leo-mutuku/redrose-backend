import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMpesaTillInteractor } from "../../interfaces/finance/IMpesaTillInteractor";

@injectable()
export class MpesaTillController {
    private mpesaTillInteractor: IMpesaTillInteractor;

    constructor(
        @inject(INTERFACE_TYPE.MpesaTillInteractor) mpesaTillInteractor: IMpesaTillInteractor
    ) {
        this.mpesaTillInteractor = mpesaTillInteractor;
    }

    async onCreateMpesaTill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mpesaTillData = req.body;
            const newMpesaTill = await this.mpesaTillInteractor.createMpesaTill(mpesaTillData);
            res.status(201).json({ success: true, data: newMpesaTill });
        } catch (error) {
            next(error);
        }
    }

    async onGetMpesaTill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mpesaTillId = req.params.id;
            const mpesaTill = await this.mpesaTillInteractor.getMpesaTillById(mpesaTillId);
            res.status(200).json({ success: true, data: mpesaTill });
        } catch (error) {
            next(error);
        }
    }

    async onGetMpesaTills(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mpesaTills = await this.mpesaTillInteractor.getAllMpesaTills();
            res.status(200).json({ success: true, data: mpesaTills });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMpesaTill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mpesaTillId = req.params.id;
            const updateData = req.body;
            const updatedMpesaTill = await this.mpesaTillInteractor.updateMpesaTill(mpesaTillId, updateData);
            res.status(200).json({ success: true, data: updatedMpesaTill });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteMpesaTill(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const mpesaTillId = req.params.id;
            await this.mpesaTillInteractor.deleteMpesaTill(mpesaTillId);
            res.status(200).json({ success: true, message: "Mpesa Till deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
