import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IRestaurantStoreInteractor } from "../../interfaces/store/IRestaurantStoreInteractor";

@injectable()
export class RestaurantStoreController {
    private interactor: IRestaurantStoreInteractor;

    constructor(@inject(INTERFACE_TYPE.RestaurantStoreInteractor) interactor: IRestaurantStoreInteractor) {
        this.interactor = interactor;
    }

    async onCreateRestaurantStore(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createRestaurantStore(body);
            res.status(201).json({ status: 'success', data: data, message: 'Restaurant store item created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRestaurantStores(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getRestaurantStores(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Restaurant store items fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetRestaurantStore(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getRestaurantStore(id);
            res.status(200).json({ status: 'success', data: data, message: 'Restaurant store item fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateRestaurantStore(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateRestaurantStore(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Restaurant store item updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onRestaurantTracking(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.interactor.getRestaurantTracking();
            res.status(200).json({
                status: "success",
                data: data,
                message: "Restaurant tracking fetched successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    async onDeleteRestaurantStore(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.deleteRestaurantStore(id);
            res.status(200).json({ status: 'success', data: data, message: 'Restaurant store item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

