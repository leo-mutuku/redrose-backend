import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreItemInteractor } from "../../interfaces/store/IStoreItemInteractor";
import { Auth } from "../../entities/administration/Auth";

@injectable()
export class StoreItemController {
    private interactor: IStoreItemInteractor;

    constructor(@inject(INTERFACE_TYPE.StoreItemInteractor) interactor: IStoreItemInteractor) {
        this.interactor = interactor;
    }

    async onCreateStoreItem(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createStoreItem(body);
            res.status(201).json({ status: 'success', data: data, message: 'Store item created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreItems(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getStoreItems(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Store items fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetStoreItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getStoreItem(id);
            res.status(200).json({ status: 'success', data: data, message: 'Store item fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateStoreItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateStoreItem(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Store item updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetItemtracking(req: Request, res: Response, next: NextFunction) {
        try {
            //const Loggineduser: Auth = req.user
            console.log(req.body.user)



            const data = await this.interactor.getItemtracking()
            res.status(200).json({
                status: "success",
                data: data,
                message: "Store tracking"
            })


        } catch (error) {
            next(error)

        }



    }

    async onDeleteStoreItem(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            await this.interactor.deleteStoreItem(id);
            res.status(200).json({ status: 'success', message: 'Store item deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}
