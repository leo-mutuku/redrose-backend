import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IItemRegisterInteractor } from "../../interfaces/store/IItemRegisterInteractor";  // Adjusted import for Store Register Interactor

@injectable()
export class ItemRegisterController {
    private interactor: IItemRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.ItemRegisterInteractor) interactor: IItemRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            body.created_by = req.body.user.staff_id
            console.log(body)

            const data = await this.interactor.createRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Item registered successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Item registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Item register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Item register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
