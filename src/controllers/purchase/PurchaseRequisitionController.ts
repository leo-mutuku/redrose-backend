import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPurchaseRequisitionInteractor } from "../../interfaces/purchase/IpurchaseRequisitionInteractor";
import { AppError } from "../../utils/AppError";

@injectable()
export class PurchaseRequisitionController {
    private interactor: IPurchaseRequisitionInteractor;

    constructor(@inject(INTERFACE_TYPE.PurchaseRequisitionInteractor) interactor: IPurchaseRequisitionInteractor) {
        this.interactor = interactor;
    }

    async onCreatePurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("req.body", req.body);
            let body = req.body;
            req.body.shift_id = req.body.user.shift_id;
            req.body.staff_id = req.body.user.staff_id;
            // validations
            if (body.account_type == "CASH") {
                if (!body.cash_account_id) {
                    throw new AppError('Cash account id is required');
                }
            }
            if (body.account_type == "BANK") {
                if (body?.bank_id && !body.bank_id) {
                    throw new AppError('Bank id is required');
                }
            }
            if (Number(body.total) !== body.order_details.reduce((sum, item) => sum + Number(item.total_price), 0)) {
                throw new AppError('Total must be equal to sum of item prices');
            }

            if (!body.order_details || body.order_details.length === 0) {
                throw new AppError('Order details is required');

            }
            for (let x of body.order_details) {
                if (!x.store_item_id) {
                    throw new AppError('Item store id is required');
                }
                if (!x.quantity) {
                    throw new AppError('Quantity is required');
                }
                if (!x.buying_price) {
                    throw new AppError('Buying priceis required');
                }
                if (!x.vat_type) {
                    throw new AppError('Vat type is required');
                }
            }
            const data = await this.interactor.createPurchaseRequisition(body);
            res.status(201).json({ status: 'success', data: data, message: 'Purchase requisition created successfully' });
        } catch (error) {
            next(error);
        }
    }
    async onGetPurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const data = await this.interactor.getPurchaseRequisition(id);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisition fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseRequisitions(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPurchaseRequisitions(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisitions fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePurchaseRequisition(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePurchaseRequisition(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase requisition updated successfully' });
        } catch (error) {
            next(error);
        }
    }


}
