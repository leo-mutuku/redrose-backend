import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPurchaseRequisitionInteractor } from "../../interfaces/purchase/IpurchaseRequisitionInteractor";

@injectable()
export class PurchaseRequisitionController {
    private interactor: IPurchaseRequisitionInteractor;

    constructor(@inject(INTERFACE_TYPE.PurchaseRequisitionInteractor) interactor: IPurchaseRequisitionInteractor) {
        this.interactor = interactor;
    }

    async onCreatePurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPurchaseRequisition(body);
            res.status(201).json({ status: 'success', data: data, message: 'Purchase requisition created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPurchaseRequisition(id);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisition fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseRequisitions(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPurchaseRequisitions(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisitions fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePurchaseRequisition(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisition updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePurchaseRequisition(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePurchaseRequisition(id);
    //         res.status(200).json({ status: 'success', message: 'Purchase requisition deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
