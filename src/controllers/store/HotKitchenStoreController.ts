import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IHotKitchenStoreInteractor } from "../../interfaces/store/IHotKitchenStoreInteractor";

@injectable()
export class HotKitchenStoreController {
    private interactor: IHotKitchenStoreInteractor;

    constructor(@inject(INTERFACE_TYPE.HotKitchenStoreInteractor) interactor: IHotKitchenStoreInteractor) {
        this.interactor = interactor;
    }

    async onCreateHotKitchenStore(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createHotKitchenStore(body);
            res.status(201).json({ status: 'success', data: data, message: 'Hot kitchen store item created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetHotKitchenStores(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getHotKitchenStores(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Hot kitchen store items fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetHotKitchenStore(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getHotKitchenStore(id);
            res.status(200).json({ status: 'success', data: data, message: 'Hot kitchen store item fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateHotKitchenStore(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateHotKitchenStore(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Hot kitchen store item updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onKitchenTracking(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.interactor.getKitchenTracking();
            res.status(200).json({
                status: "success",
                data: data,
                message: "Kitchen tracking"

            })

        } catch (error) {
            next(error)

        }

    }
}
