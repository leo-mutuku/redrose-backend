import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IVendorInteractor } from "../../interfaces/administation/IVendorInteractor";

@injectable()
export class VendorController {
    private interactor: IVendorInteractor
    constructor(@inject(INTERFACE_TYPE.VendorInteractor) interactor: IVendorInteractor) {
        this.interactor = interactor
    }
    async onCreateVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body
            const data = await this.interactor.createVendor(body)
            res.status(201).json({ status: 'success', data: data, message: 'Vendor created successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetVendors(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 20
            const data = await this.interactor.getVendors(limit, offset)
            res.status(200).json({ status: 'success', data: data, message: 'Vendors fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const data = await this.interactor.getVendor(id)
            res.status(200).json({ status: 'success', data: data, message: 'Vendor fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onUpdateVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const body = req.body
            const data = await this.interactor.updateVendor(id, body)
            res.status(200).json({ status: 'success', data: data, message: 'Vendor updated successfully' });
        }
        catch (error) {
            next(error)
        }
    }
}