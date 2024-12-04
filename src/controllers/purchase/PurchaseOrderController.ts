import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPurchaseOrderInteractor } from "../../interfaces/purchase/IPurchaseOrderInteractor";

@injectable()
export class PurchaseOrderController {
    private interactor: IPurchaseOrderInteractor;

    constructor(@inject(INTERFACE_TYPE.PurchaseOrderInteractor) interactor: IPurchaseOrderInteractor) {
        this.interactor = interactor;
    }

    async onCreatePurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPurchaseOrder(body);
            res.status(201).json({ status: 'success', data: data, message: 'Purchase order created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPurchaseOrder(id);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase order fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPurchaseOrders(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase orders fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePurchaseOrder(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase order updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePurchaseOrder(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePurchaseOrder(id);
    //         res.status(200).json({ status: 'success', message: 'Purchase order deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
