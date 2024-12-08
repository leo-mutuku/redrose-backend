import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreTransferInteractor } from "../../interfaces/store/IStoreTransferInteractor";

@injectable()
export class StoreTransferController {
    private interactor: IStoreTransferInteractor;

    constructor(@inject(INTERFACE_TYPE.StoreTransferInteractor) interactor: IStoreTransferInteractor) {
        this.interactor = interactor;
    }

    async onCreateStoreTransfer(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createStoreTransfer(body);
            res.status(201).json({ status: 'success', data: data, message: 'Store transfer created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreTransfers(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getStoreTransfers(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Store transfers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreTransfer(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getStoreTransfer(id);
            res.status(200).json({ status: 'success', data: data, message: 'Store transfer fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateStoreTransfer(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateStoreTransfer(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Store transfer updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
