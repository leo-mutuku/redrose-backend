import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPurchaseOrderInteractor } from "../../interfaces/purchase/IPurchaseOrderInteractor";

@injectable()
export class PurchaseOrderController {
    private interactor: IPurchaseOrderInteractor;
    constructor(@inject(INTERFACE_TYPE.PurchaseOrderInteractor) interactor: IPurchaseOrderInteractor) {
        this.interactor = interactor;
    }
    async onCreatePurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;
            if (!body.purchase_date) {
                res.status(400).json({ status: 'error', message: 'Purchase date is required, default not allowed' });

                return;
            }
            console.log(body);
            // if (!body.vat) {
            //     res.status(400).json({ status: 'error', message: 'VAT type is required' });
            //     return;
            // }
            if (body.pay_mode == 'CASH') {
                if (!body.account_type) {
                    res.status(400).json({ status: 'error', message: 'Account type is required' });
                    return;
                    if (body.account_type == 'CASH') {
                        if (!body.cash_account_id) {
                            res.status(400).json({ status: 'error', message: 'Cash account is required' });
                            return;
                        }
                    }
                    if (body.account_type == 'BANK') {
                        if (!body.bank_id) {
                            res.status(400).json({ status: 'error', message: 'Bank account is required' });
                            return;
                        }
                    }

                }

            }
            body.staff_id = req.body.user.staff_id
            body.shift_id = req.body.user.shift_id
            // validate inputs -- check if order array has all values well entered
            if (!body.order_details.length) {
                res.status(400).json({ status: 'error', message: 'Order details are required' });
                return;
            }
            for (let item of body.order_details) {
                if (!item.store_item_id || !item.quantity || !item.buying_price || !item.total_price) {
                    res.status(400).json({ status: 'error', message: 'Please make sure the order details are well entered' });
                    return;
                }
            }
            const data = await this.interactor.createPurchaseOrder(body);
            res.status(201).json({ status: 'success', data: data, message: 'Purchase order created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getPurchaseOrder(id);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase order fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetPurchaseOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getPurchaseOrders(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase orders fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdatePurchaseOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updatePurchaseOrder(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Purchase order updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeletePurchaseOrder(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deletePurchaseOrder(id);
    //         res.status(200).json({ status: 'success', message: 'Purchase order deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
