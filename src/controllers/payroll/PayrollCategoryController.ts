import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPayrollCategoryInteractor } from "../../interfaces/payroll/IPayrollCategoryInteractor";

@injectable()
export class PayrollCategoryController {
    private interactor: IPayrollCategoryInteractor;

    constructor(@inject(INTERFACE_TYPE.PayrollCategoryInteractor) interactor: IPayrollCategoryInteractor) {
        this.interactor = interactor;
    }

    async onCreatePayrollCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPayrollCategory(body);
            res.status(201).json({ status: 'success', data: data, message: 'Payroll category created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPayrollCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPayrollCategory(id);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll category fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPayrollCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPayrollCategories(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll categories fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePayrollCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePayrollCategory(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll category updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePayrollCategory(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePayrollCategory(id);
    //         res.status(200).json({ status: 'success', message: 'Payroll category deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
