import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPayrollSetupInteractor } from "../../interfaces/payroll/IPayrollSetupInteractor";

@injectable()
export class PayrollSetupController {
    private interactor: IPayrollSetupInteractor;

    constructor(@inject(INTERFACE_TYPE.PayrollSetupInteractor) interactor: IPayrollSetupInteractor) {
        this.interactor = interactor;
    }

    async onCreatePayrollSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPayrollSetup(body);
            res.status(201).json({ status: 'success', data: data, message: 'Payroll setup record created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPayrollSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPayrollSetup(id);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll setup record fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetAllPayrollSetups(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPayrollSetups(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll setup records fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePayrollSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePayrollSetup(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Payroll setup record updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePayrollSetup(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePayrollSetup(id);
    //         res.status(200).json({ status: 'success', message: 'Payroll setup record deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
