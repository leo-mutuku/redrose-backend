import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuCategoryInteractor } from "../../interfaces/store/IMenuCategoryInteractor";

@injectable()
export class MenuCategoryController {
    private interactor: IMenuCategoryInteractor;

    constructor(@inject(INTERFACE_TYPE.MenuCategoryInteractor) interactor: IMenuCategoryInteractor) {
        this.interactor = interactor;
    }

    async onCreateMenuCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createMenuCategory(body);
            res.status(201).json({ status: 'success', data: data, message: 'Menu category created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getMenuCategories(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Menu categories fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetMenuCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getMenuCategory(id);
            res.status(200).json({ status: 'success', data: data, message: 'Menu category fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateMenuCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateMenuCategory(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Menu category updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
