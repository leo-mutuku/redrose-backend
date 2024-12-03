import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IVoidedBillInteractor } from "../../interfaces/sales/IVoidedBillInteractor";

@injectable()
export class VoidedBillController {
    private interactor: IVoidedBillInteractor;

    constructor(@inject(INTERFACE_TYPE.VoidedBillInteractor) interactor: IVoidedBillInteractor) {
        this.interactor = interactor;
    }

    async onCreateVoidedBill(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createVoidedBill(body);
            res.status(201).json({ status: 'success', data: data, message: 'Voided bill created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetVoidedBills(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getVoidedBills(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Voided bills fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetVoidedBill(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getVoidedBill(id);
            res.status(200).json({ status: 'success', data: data, message: 'Voided bill fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateVoidedBill(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateVoidedBill(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Voided bill updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteVoidedBill(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            await this.interactor.deleteVoidedBill(id);
            res.status(200).json({ status: 'success', message: 'Voided bill deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
