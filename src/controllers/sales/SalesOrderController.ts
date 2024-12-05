import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ISalesOrderInteractor } from "../../interfaces/sales/ISalesOrderInteractor";

@injectable()
export class SalesOrderController {
    private interactor: ISalesOrderInteractor;

    constructor(@inject(INTERFACE_TYPE.SalesOrderInteractor) interactor: ISalesOrderInteractor) {
        this.interactor = interactor;
    }

    async onCreateSalesOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createSalesOrder(body);
            res.status(201).json({ status: 'success', data: data, message: 'Sales order created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetSalesOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getSalesOrders(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Sales orders fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetSalesOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getSalesOrder(id);
            res.status(200).json({ status: 'success', data: data, message: 'Sales order fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateSalesOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateSalesOrder(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Sales order updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeleteSalesOrder(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deleteSalesOrder(id);
    //         res.status(200).json({ status: 'success', message: 'Sales order deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
