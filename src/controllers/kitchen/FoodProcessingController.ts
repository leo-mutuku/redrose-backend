import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IFoodProcessingInteractor } from "../../interfaces/store/IFoodProcessingInteractor";

@injectable()
export class FoodProcessingController {
    private interactor: IFoodProcessingInteractor;

    constructor(@inject(INTERFACE_TYPE.FoodProcessingInteractor) interactor: IFoodProcessingInteractor) {
        this.interactor = interactor;
    }

    async onCreateFoodProcessing(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createFoodProcessing(body);
            res.status(201).json({ status: 'success', data: data, message: 'Food processing record created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetFoodProcessings(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getFoodProcessings(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Food processing records fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetFoodProcessing(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getFoodProcessing(id);
            res.status(200).json({ status: 'success', data: data, message: 'Food processing record fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateFoodProcessing(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateFoodProcessing(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Food processing record updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}
