import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ICashierRegisterInteractor } from "../../interfaces/sales/ICashierRegisterInteractor";

@injectable()
export class CashierRegisterController {
    private interactor: ICashierRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.CashierRegisterInteractor) interactor: ICashierRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateCashierRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createCashierRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Cashier register created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetCashierRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getCashierRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Cashier registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetCashierRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getCashierRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Cashier register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateCashierRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateCashierRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Cashier register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
