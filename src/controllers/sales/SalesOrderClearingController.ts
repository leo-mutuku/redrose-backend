import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ISalesOrderClearingInteractor } from "../../interfaces/sales/ISalesOrderClearingInteractor";

@injectable()
export class SalesOrderClearingController {
    private interactor: ISalesOrderClearingInteractor;

    constructor(@inject(INTERFACE_TYPE.SalesOrderClearingInteractor) interactor: ISalesOrderClearingInteractor) {
        this.interactor = interactor;
    }

    async onCreateSalesOrderClearing(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createSalesOrderClearing(body);
            res.status(201).json({ status: 'success', data: data, message: 'Sales order clearing created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetSalesOrderClearings(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getSalesOrderClearings(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Sales order clearings fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetSalesOrderClearing(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getSalesOrderClearing(id);
            res.status(200).json({ status: 'success', data: data, message: 'Sales order clearing fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateSalesOrderClearing(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateSalesOrderClearing(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Sales order clearing updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
