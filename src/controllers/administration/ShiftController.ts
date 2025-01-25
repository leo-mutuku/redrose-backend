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

            if (req.body.shift_start == null || req.body.shift_start == undefined) {
                return res.status(400).json({
                    status: "failed",
                    message: "Shift start time is required"
                })
            }

            const created_by = req.body.user.staff_id
            const body = { ...req.body, created_by };

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
            const limit = parseInt(req.query.limit as string) || 20;
            const offset = parseInt(req.query.offset as string) || 0;
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