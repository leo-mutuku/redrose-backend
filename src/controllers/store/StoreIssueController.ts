import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreIssueInteractor } from "../../interfaces/store/IStoreIssueInteractor";

@injectable()
export class StoreIssueController {
    private interactor: IStoreIssueInteractor;

    constructor(@inject(INTERFACE_TYPE.StoreIssueInteractor) interactor: IStoreIssueInteractor) {
        this.interactor = interactor;
    }

    async onCreateStoreIssue(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createStoreIssue(body);
            res.status(201).json({ status: 'success', data: data, message: 'Store issue created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreIssues(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 20;
            const data = await this.interactor.getStoreIssues(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Store issues fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreIssue(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getStoreIssue(id);
            res.status(200).json({ status: 'success', data: data, message: 'Store issue fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateStoreIssue(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateStoreIssue(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Store issue updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
