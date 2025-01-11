import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IPOSPrintInteractor } from "../../interfaces/IPOSPrintInteractor";
import { INTERFACE_TYPE } from "../../utils";

@injectable()
export class PrintPosController {
    private readonly interactor: IPOSPrintInteractor;
    constructor(@inject(INTERFACE_TYPE.POSPrintInteractor) interactor: IPOSPrintInteractor) {
        this.interactor = interactor;
    }
    async printPos(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("print pos controller");
            const header: {} = {}
            const body: [] = []
            const footer: {} = {}
            const result = this.interactor.print(header, body, footer);
            res.status(200).json({
                status: "success",
                data: result
            });
        } catch (error) {
            next(error);
        }

    }



}