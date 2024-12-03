import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IKitchenStationInteractor } from "../../interfaces/store/IKitchenStationInteractor";

@injectable()
export class KitchenStationController {
    private interactor: IKitchenStationInteractor;

    constructor(@inject(INTERFACE_TYPE.KitchenStationInteractor) interactor: IKitchenStationInteractor) {
        this.interactor = interactor;
    }

    async onCreateKitchenStation(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createKitchenStation(body);
            res.status(201).json({ status: 'success', data: data, message: 'Kitchen station created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetKitchenStations(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getKitchenStations(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen stations fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetKitchenStation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getKitchenStation(id);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen station fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateKitchenStation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateKitchenStation(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Kitchen station updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
