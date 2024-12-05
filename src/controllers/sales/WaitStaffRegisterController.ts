import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IWaitStaffRegisterInteractor } from "../../interfaces/sales/IWaitStaffRegisterInteractor";

@injectable()
export class WaitStaffRegisterController {
    private interactor: IWaitStaffRegisterInteractor;

    constructor(@inject(INTERFACE_TYPE.WaitStaffRegisterInteractor) interactor: IWaitStaffRegisterInteractor) {
        this.interactor = interactor;
    }

    async onCreateWaitStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body;

            const data = await this.interactor.createWaitStaffRegister(body);
            res.status(201).json({ status: 'success', data: data, message: 'Wait staff registered successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetWaitStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);

            const data = await this.interactor.getWaitStaffRegister(id);
            res.status(200).json({ status: 'success', data: data, message: 'Wait staff details fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onGetWaitStaffs(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const data = await this.interactor.getWaitStaffRegisters(limit, offset);
            res.status(200).json({ status: 'success', data: data, message: 'Wait staff fetched successfully' });
        } catch (error) {
            next(error);
        }
    }

    async onUpdateWaitStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const body = req.body;

            const data = await this.interactor.updateWaitStaffRegister(id, body);
            res.status(200).json({ status: 'success', data: data, message: 'Wait staff details updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    // async onDeleteWaitStaff(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const id = parseInt(req.params.id);

    //         await this.interactor.deleteWaitStaff(id);
    //         res.status(200).json({ status: 'success', message: 'Wait staff deleted successfully' });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
