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

            let staff_id = req.body?.user?.staff_id;
            if (!staff_id) {
                staff_id = req.body?.staff_id
            }
            if (!staff_id) {
                return res.status(400).json({ status: 'error', message: 'Missing staff_id' });
            }
            req.body.staff_id = staff_id;
            const body = req.body;

            const data = await this.interactor.createSalesOrder(body);
            res.status(201).json({ status: 'success', data: data, message: 'Success thanks!' });
        } catch (error) {
            next(error);
        }
    }

    async onGetSalesOrders(req: Request, res: Response, next: NextFunction) {
        try {
            let { search, status, offset, limit } = req.body;
            search = parseInt(search) || 0;
            offset = parseInt(offset) || 0;
            limit = parseInt(limit) || 50;
            const data = await this.interactor.getSalesOrders(search, status, limit, offset);
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

    async onAuthWaiter(req: Request, res: Response, next: NextFunction) {
        try {

            const { pin, staff_id } = req.body;
            const data = await this.interactor.authWaiter(pin, staff_id);
            res.status(200).json({
                status: 'success', data: data, message:
                    'Sales order updated successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }


}
