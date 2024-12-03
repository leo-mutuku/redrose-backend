import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IKitchenSetupInteractor } from "../../interfaces/kitchen/IKitchenSetupInteractor";

@injectable()
export class KitchenSetupController {
    private interactor: IKitchenSetupInteractor;

    constructor(@inject(INTERFACE_TYPE.KitchenSetupInteractor) interactor: IKitchenSetupInteractor) {
        this.interactor = interactor;
    }

    async onCreateKitchenSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createKitchenSetup(body);
            res.status(201).json({ status: 'success', data: data, message: 'Kitchen setup created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetKitchenSetups(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getKitchenSetups(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen setups fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetKitchenSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getKitchenSetup(id);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen setup fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateKitchenSetup(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateKitchenSetup(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen setup updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
