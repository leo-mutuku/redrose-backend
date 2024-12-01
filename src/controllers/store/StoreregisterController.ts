import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreRegisterInteractor } from "../../interfaces/store/IStoreRegisterInteractor";

@injectable()
export class StoreRegisterController {
    private interactor: IStoreRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.StoreRegisterInteractor) interactor: IStoreRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Store register created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Store registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Store register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Store register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
