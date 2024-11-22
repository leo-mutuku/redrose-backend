import { NextFunction, Request, Response } from "express";

export class ShiftController {

    async onCreateShift(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("shift controller");
        } catch (error) {
            next(error);
        }
    }
    async onUpdateShift(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("shift controller");
        } catch (error) {
            next(error);
        }
    }
    async onGetShift(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("shift controller");
        } catch (error) {
            next(error);
        }
    }
    async onGetShifts(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("shift controller");
        } catch (error) {
            next(error);
        }
    }
}