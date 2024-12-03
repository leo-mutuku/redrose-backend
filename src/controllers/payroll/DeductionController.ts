import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IDeductionInteractor } from "../../interfaces/payroll/IDeductionInteractor";

@injectable()
export class DeductionController {
    private interactor: IDeductionInteractor;

    constructor(@inject(INTERFACE_TYPE.DeductionInteractor) interactor: IDeductionInteractor) {
        this.interactor = interactor;
    }

    async onCreateDeduction(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createDeduction(body);
            res.status(201).json({ status: 'success', data: data, message: 'Deduction created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetDeduction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getDeduction(id);
            res.status(200).json({ status: 'success', data: data, message: 'Deduction fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetDeductions(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getDeductions(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Deductions fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateDeduction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateDeduction(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Deduction updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteDeduction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            await this.interactor.deleteDeduction(id);
            res.status(200).json({ status: 'success', message: 'Deduction deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
