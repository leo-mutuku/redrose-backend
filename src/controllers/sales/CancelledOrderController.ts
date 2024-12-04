import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ICancelledOrderInteractor } from "../../interfaces/sales/ICancelledOrderInteractor";

@injectable()
export class CancelledOrderController {
    private interactor: ICancelledOrderInteractor;

    constructor(@inject(INTERFACE_TYPE.CancelledOrderInteractor) interactor: ICancelledOrderInteractor) {
        this.interactor = interactor;
    }

    async onCreateCancelledOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createCancelledOrder(body);
            res.status(201).json({ status: 'success', data: data, message: 'Cancelled order created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetCancelledOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getCancelledOrders(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Cancelled orders fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetCancelledOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getCancelledOrder(id);
            res.status(200).json({ status: 'success', data: data, message: 'Cancelled order fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateCancelledOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateCancelledOrder(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Cancelled order updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
