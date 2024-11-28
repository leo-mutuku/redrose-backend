import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";

import { IAccountInteractor } from "../../interfaces/finance/IAccountInteractor";

@injectable()
export class AccountController {
    private accountInteractor: IAccountInteractor

    constructor(
        @inject(INTERFACE_TYPE.AccountInteractor) accountInteractor: IAccountInteractor
    ) {
        this.accountInteractor = accountInteractor;
    }

    async onCreateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const accountData = req.body;
            const newAccount = await this.accountInteractor.createAccount(accountData);
            res.status(201).json({ success: true, data: newAccount });
        } catch (error) {
            next(error)

        }
    }

    async onGetAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const account_id = parseInt(req.params.id);
            const account = await this.accountInteractor.getAccountById(account_id);
            res.status(200).json({ success: true, data: account });
        } catch (error) {
            next(error)
        }
    }

    async onGetAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;
            const accounts = await this.accountInteractor.getAllAccounts(limit, offset);
            res.status(200).json({ success: true, data: accounts });
        } catch (error) {
            next(error)
        }
    }

    async onUpdateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const account_id = parseInt(req.params.id);
            const updateData = req.body;
            const updatedAccount = await this.accountInteractor.updateAccount(account_id, updateData);
            res.status(200).json({ success: true, data: updatedAccount });
        } catch (error) {
            next(error)
        }
    }

    async onDeleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const account_id = parseInt(req.params.id);
            await this.accountInteractor.deleteAccount(account_id);
            res.status(200).json({ success: true, message: "Account deleted successfully" });
        } catch (error) {
            next(error)
        }
    }
}
