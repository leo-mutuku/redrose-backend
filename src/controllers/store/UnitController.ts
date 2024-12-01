import { NextFunction, Request, Response } from "express";

import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IUnitInteractor } from "../../interfaces/store/IUnitInteractor";

@injectable()
export class UnitController {
    private interactor: IUnitInteractor;

    constructor(@inject(INTERFACE_TYPE.UnitInteractor) interactor: IUnitInteractor) {
        this.interactor = interactor;
    }

    async onCreateUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createUnit(body);
            res.status(201).json({ status: 'success', data: data, message: 'Unit created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetUnits(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getUnits(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Units fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getUnit(id);
            res.status(200).json({ status: 'success', data: data, message: 'Unit fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateUnit(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Unit updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
