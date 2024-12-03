import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuRegisterInteractor } from "../../interfaces/store/IMenuRegisterInteractor";

@injectable()
export class MenuRegisterController {
    private interactor: IMenuRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.MenuRegisterInteractor) interactor: IMenuRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateMenuRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createMenuRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Menu Register created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getMenuRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getMenuRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMenuRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateMenuRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
