import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IGLAccountInteractor } from "../../interfaces/finance/IGLAccountInteractor";

@injectable()
export class GLAccountController {
    private glAccountInteractor: IGLAccountInteractor;

    constructor(
        @inject(INTERFACE_TYPE.GLAccountInteractor) glAccountInteractor: IGLAccountInteractor
    ) {
        this.glAccountInteractor = glAccountInteractor;
    }

    async onCreateGLAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const glAccountData = req.body;
            const newGLAccount = await this.glAccountInteractor.createGLAccount(glAccountData);
            res.status(201).json({ success: true, data: newGLAccount });
        } catch (error) {
            next(error);
        }
    }

    async onGetGLAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const glAccountId = parseInt(req.params.id);
            const glAccount = await this.glAccountInteractor.getGLAccountById(glAccountId);
            res.status(200).json({ success: true, data: glAccount });
        } catch (error) {
            next(error);
        }
    }

    async onGetGLAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;
            const glAccounts = await this.glAccountInteractor.getAllGLAccounts(limit, offset);
            res.status(200).json({ success: true, data: glAccounts });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateGLAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const glAccountId = parseInt(req.params.id);
            const updateData = req.body;
            const updatedGLAccount = await this.glAccountInteractor.updateGLAccount(glAccountId, updateData);
            res.status(200).json({ success: true, data: updatedGLAccount });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteGLAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const glAccountId = parseInt(req.params.id);
            await this.glAccountInteractor.deleteGLAccount(glAccountId);
            res.status(200).json({ success: true, message: "GL Account deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}
