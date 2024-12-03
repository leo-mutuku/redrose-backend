import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuItemRegisterInteractor } from "../../interfaces/store/IMenuItemRegisterInteractor";

@injectable()
export class MenuItemRegisterController {
    private interactor: IMenuItemRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.MenuItemRegisterInteractor) interactor: IMenuItemRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateMenuItemRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createMenuItemRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Menu Item Register created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuItemRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getMenuItemRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuItemRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getMenuItemRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMenuItemRegister(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateMenuItemRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
