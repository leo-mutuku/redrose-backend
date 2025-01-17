import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IPrintBillInteractor } from "../../interfaces/sales/IPrintBillInteractor";
import { INTERFACE_TYPE } from "../../utils";

@injectable()
export class PrintBillController {
    private readonly interactor: IPrintBillInteractor;
    constructor(@inject(INTERFACE_TYPE.PrintBillInteractor) interactor: IPrintBillInteractor) {
        this.interactor = interactor;
    }
    async printPos(req: Request, res: Response, next: NextFunction) {
        try {
            const { bill_id } = req.body;
            const result = this.interactor.printBill(bill_id);
            res.status(200).json({
                status: "success",
                data: result
            });
        } catch (error) {
            next(error);
        }

    }



}