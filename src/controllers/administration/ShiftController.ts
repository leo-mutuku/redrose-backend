import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ShiftInteractor } from "../../interactors/administration/ShiftInterator";

@injectable()
export class ShiftController {
    private shiftInteractor: ShiftInteractor;
    constructor(
        @inject(INTERFACE_TYPE.ShiftInteractor) shiftInteractor: ShiftInteractor,
    ) {
        this.shiftInteractor = shiftInteractor;
    }

    async onCreateShift(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const result = await this.shiftInteractor.createShift(body);
            res.status(201).json({
                status: "success",
                message: "Shift created successfully",
                data: result
            })

        } catch (error) {
            next(error);
        }
    }
    async onUpdateShift(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            const id = parseInt(req.params.id);
            const result = await this.shiftInteractor.updateShift(id, body);
        } catch (error) {
            next(error);
        }
    }
    async onGetShift(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.shiftInteractor.getShift(id);
            res.status(200).json({
                status: "success",
                message: "Shift fetched successfully",
                data: result
            })
        } catch (error) {
            next(error);
        }
    }
    async onGetShifts(req: Request, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit as string);
            const offset = parseInt(req.query.offset as string);
            const result = await this.shiftInteractor.getShifts(limit, offset);
            res.status(200).json({
                status: "success",
                message: "Shifts fetched successfully",
                data: result
            })
        } catch (error) {
            next(error);
        }
    }
}