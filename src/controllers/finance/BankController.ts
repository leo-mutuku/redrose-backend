import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IBankInteractor } from "../../interfaces/finance/IBankInteractor";

@injectable()
export class BankController {
    private bankInteractor: IBankInteractor;

    constructor(
        @inject(INTERFACE_TYPE.BankInteractor) bankInteractor: IBankInteractor
    ) {
        this.bankInteractor = bankInteractor;
    }

    async onCreateBank(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bankData = req.body;
            const newBank = await this.bankInteractor.createBank(bankData);
            res.status(201).json({ success: true, data: newBank });
        } catch (error) {
            next(error);
        }
    }

    async onGetBank(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bankId = parseInt(req.params.id);
            const bank = await this.bankInteractor.getBankById(bankId);
            res.status(200).json({ success: true, data: bank });
        } catch (error) {
            next(error);
        }
    }

    async onGetBanks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;
            const banks = await this.bankInteractor.getAllBanks(limit, offset);
            res.status(200).json({ success: true, data: banks });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateBank(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bankId = parseInt(req.params.id);
            const updateData = req.body;
            const updatedBank = await this.bankInteractor.updateBank(bankId, updateData);
            res.status(200).json({ success: true, data: updatedBank });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteBank(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bankId = parseInt(req.params.id);
            await this.bankInteractor.deleteBank(bankId);
            res.status(200).json({ success: true, message: "Bank deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
