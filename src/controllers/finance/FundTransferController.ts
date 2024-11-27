import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IFundTransferInteractor } from "../../interfaces/finance/IFundTransferInteractor";

@injectable()
export class FundTransferController {
    private fundTransferInteractor: IFundTransferInteractor;

    constructor(
        @inject(INTERFACE_TYPE.FundTransferInteractor) fundTransferInteractor: IFundTransferInteractor
    ) {
        this.fundTransferInteractor = fundTransferInteractor;
    }

    async onInitiateFundTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transferData = req.body;
            const initiatedTransfer = await this.fundTransferInteractor.initiateFundTransfer(transferData);
            res.status(201).json({ success: true, data: initiatedTransfer });
        } catch (error) {
            next(error);
        }
    }

    async onGetFundTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transferId = req.params.id;
            const transferDetails = await this.fundTransferInteractor.getFundTransferById(transferId);
            res.status(200).json({ success: true, data: transferDetails });
        } catch (error) {
            next(error);
        }
    }

    async onGetAllFundTransfers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const fundTransfers = await this.fundTransferInteractor.getAllFundTransfers();
            res.status(200).json({ success: true, data: fundTransfers });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateFundTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transferId = req.params.id;
            const updateData = req.body;
            const updatedTransfer = await this.fundTransferInteractor.updateFundTransfer(transferId, updateData);
            res.status(200).json({ success: true, data: updatedTransfer });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteFundTransfer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const transferId = req.params.id;
            await this.fundTransferInteractor.deleteFundTransfer(transferId);
            res.status(200).json({ success: true, message: "Fund transfer deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
