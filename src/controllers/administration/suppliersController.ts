import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ISupplierInteractor } from "../../interfaces/administation/ISupplierInteractor";

@injectable()
export class SupplierController {
    private interactor: ISupplierInteractor
    constructor(@inject(INTERFACE_TYPE.SupplierInteractor) interactor: ISupplierInteractor) {
        this.interactor = interactor
    }
    async onCreateSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body
            body.created_by = req.body.user.staff_id
            const data = await this.interactor.createSupplier(body)
            res.status(201).json({ status: 'success', data: data, message: 'Supplier created successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetSuppliers(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 10
            const data = await this.interactor.getSuppliers(limit, offset)
            res.status(200).json({ status: 'success', data: data, message: 'Suppliers fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const data = await this.interactor.getSupplier(id)
            res.status(200).json({ status: 'success', data: data, message: 'Supplier fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onUpdateSupplier(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const body = req.body
            const data = await this.interactor.updateSupplier(id, body)
            res.status(200).json({ status: 'success', data: data, message: 'Supplier updated successfully' });
        }
        catch (error) {
            next(error)
        }
    }
}