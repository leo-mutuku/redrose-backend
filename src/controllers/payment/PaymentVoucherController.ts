import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPaymentVoucherInteractor } from "../../interfaces/payroll/IPaymentVoucherInteractor";

@injectable()
export class PaymentVoucherController {
    private interactor: IPaymentVoucherInteractor;

    constructor(@inject(INTERFACE_TYPE.PaymentVoucherInteractor) interactor: IPaymentVoucherInteractor) {
        this.interactor = interactor;
    }

    async onCreatePaymentVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createPaymentVoucher(body);
            res.status(201).json({ status: 'success', data: data, message: 'Payment voucher created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPaymentVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPaymentVoucher(id);
            res.status(200).json({ status: 'success', data: data, message: 'Payment voucher fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPaymentVouchers(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPaymentVouchers(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Payment vouchers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePaymentVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePaymentVoucher(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Payment voucher updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onDeletePaymentVoucher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            await this.interactor.deletePaymentVoucher(id);
            res.status(200).json({ status: 'success', message: 'Payment voucher deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
