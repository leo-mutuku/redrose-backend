import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPayrollInteractor } from "../../interfaces/payroll/IPayrollInteractor";


@injectable()
export class PayrollController {
    private interactor: IPayrollInteractor;

    constructor(@inject(INTERFACE_TYPE.PayrollInteractor) interactor: IPayrollInteractor) {
        this.interactor = interactor;
    }

    async onCreatePayroll(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPayroll(body);
            res.status(201).json({ status: 'success', data: data, message: 'Payroll record created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPayroll(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPayroll(id);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll record fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetAllPayrolls(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPayrolls(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll records fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePayroll(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePayroll(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll record updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePayroll(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePayroll(id);
    //         res.status(200).json({ status: 'success', message: 'Payroll record deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
