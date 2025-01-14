import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPOSTerminalPrintBillInteractor } from "../../interfaces/sales/IPOSTerminalPrintBillInteractor";

@injectable()
export class POSTerminalPrintBillController {
    private interactor: IPOSTerminalPrintBillInteractor;

    constructor(@inject(INTERFACE_TYPE.POSTerminalPrintBillInteractor) interactor: IPOSTerminalPrintBillInteractor) {
        this.interactor = interactor;
        console.log(this.interactor);
    }

    async onPrintBill(req: Request, res: Response, next: NextFunction) {
        try {
            const billData = req.body; // Assuming bill data is sent in the request body

            const data = await this.interactor.printBill(billData);
            res.status(200).json({ status: 'success', data: data, message: 'Bill printed successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPrintStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const billId = parseInt(req.params.id); // Get bill ID from the URL parameters

            const data = await this.interactor.getPrintStatus(billId);
            res.status(200).json({ status: 'success', data: data, message: 'Print status fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onCancelBillPrinting(req: Request, res: Response, next: NextFunction) {
        try {
            const billId = parseInt(req.params.id); // Get bill ID from the URL parameters

            const data = await this.interactor.cancelBillPrinting(billId);
            res.status(200).json({ status: 'success', data: data, message: 'Bill printing cancelled successfully' });
        } catch (error) {
            next(error);
        }
    }
    async onValidateWaiter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const body = req.body

            const data = await this.interactor.validateWaiter(body)

            res.status(200).json({ status: 'success', data: data, message: 'Waiter validated successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
