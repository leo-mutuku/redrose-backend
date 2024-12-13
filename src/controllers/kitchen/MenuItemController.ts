import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuItemInteractor } from "../../interfaces/kitchen/IMenuItemInteractor";


@injectable()
export class MenuItemController {
    private interactor: IMenuItemInteractor;

    constructor(@inject(INTERFACE_TYPE.MenuItemInteractor) interactor: IMenuItemInteractor) {
        this.interactor = interactor;
    }

    async onCreateMenu(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createMenuItem(body);
            res.status(201).json({ status: 'success', data: data, message: 'Menu Item Register created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuItemRegisters(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getMenuItems(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Registers fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getMenuItem(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Register fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMenuItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateMenuItem(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Register updated successfully' });
        } catch (error) {
            next(error);
        }
    }
    async onGetmenuTracking(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.interactor.getmenuTracking()
            res.status(200).json({
                status: "success",
                data: data,
                message: "Menu tracking"
            })

        } catch (error) {
            next(error)

        }
    }

    async onDeleteMenuItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.deleteMenuItem(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu Item Register deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
