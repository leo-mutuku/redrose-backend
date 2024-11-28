import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ICashAccountInteractor } from "../../interfaces/finance/ICashAccountInteractor";

@injectable()
export class CashAccountController {
    private cashAccountInteractor: ICashAccountInteractor;

    constructor(
        @inject(INTERFACE_TYPE.CashAccountInteractor) cashAccountInteractor: ICashAccountInteractor
    ) {
        this.cashAccountInteractor = cashAccountInteractor;
    }

    async onCreateCashAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cashAccountData = req.body;
            const newCashAccount = await this.cashAccountInteractor.createCashAccount(cashAccountData);
            res.status(201).json({ success: true, data: newCashAccount });
        } catch (error) {
            next(error);
        }
    }

    async onGetCashAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cashAccountId = parseInt(req.params.id);
            const cashAccount = await this.cashAccountInteractor.getCashAccountById(cashAccountId);
            res.status(200).json({ success: true, data: cashAccount });
        } catch (error) {
            next(error);
        }
    }

    async onGetCashAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;
            const cashAccounts = await this.cashAccountInteractor.getAllCashAccounts(limit, offset);
            res.status(200).json({ success: true, data: cashAccounts });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateCashAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cashAccountId = parseInt(req.params.id);
            const updateData = req.body;
            const updatedCashAccount = await this.cashAccountInteractor.updateCashAccount(cashAccountId, updateData);
            res.status(200).json({ success: true, data: updatedCashAccount });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteCashAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cashAccountId = parseInt(req.params.id);
            await this.cashAccountInteractor.deleteCashAccount(cashAccountId);
            res.status(200).json({ success: true, message: "Cash account deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
