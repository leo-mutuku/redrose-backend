import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuUnitInteractor } from "../../interfaces/store/IMenuUnitInteractor";

@injectable()
export class MenuUnitController {
    private interactor: IMenuUnitInteractor;

    constructor(@inject(INTERFACE_TYPE.MenuUnitInteractor) interactor: IMenuUnitInteractor) {
        this.interactor = interactor;
    }

    async onCreateMenuUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createMenuUnit(body);
            res.status(201).json({ status: 'success', data: data, message: 'Menu Unit created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuUnits(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getMenuUnits(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Units fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getMenuUnit(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Unit fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMenuUnit(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateMenuUnit(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Unit updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
