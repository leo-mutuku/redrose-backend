import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IItemCategoryInteractor } from "../../interfaces/store/IItemcategoryInteractor";


@injectable()
export class ItemCategoryController {
    private interactor: IItemCategoryInteractor;

    constructor(@inject(INTERFACE_TYPE.ItemCategoryInteractor) interactor: IItemCategoryInteractor) {
        this.interactor = interactor;
    }

    async onCreateItemCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createItemCategory(body);
            res.status(201).json({ status: 'success', data: data, message: 'Item category created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetItemCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getItemCategories(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Item categories fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetItemCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getItemCategory(id);
            res.status(200).json({ status: 'success', data: data, message: 'Item category fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateItemCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateItemCategory(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Item category updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
