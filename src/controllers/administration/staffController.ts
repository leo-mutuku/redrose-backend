import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStaffInteractor } from "../../interfaces/administation/IStaffInteractor";

@injectable()
export class StaffController {
    private staffInteractor: IStaffInteractor
    constructor(@inject(INTERFACE_TYPE.StaffInteractor) staffInteractor: IStaffInteractor) {
        this.staffInteractor = staffInteractor
    }
    async onCreateStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const staff = req.body
            staff.created_by = req.body.user.staff_id
            const createdStaff = await this.staffInteractor.createStaff(staff)
            res.status(201).json({ status: "success", data: createdStaff, message: "Staff created successfully" })
        }
        catch (error) {
            next(error)
        }
    }
    async onGetStaffs(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 10
            const staffs = await this.staffInteractor.getStaffs(limit, offset)
            res.status(200).json({ status: "success", data: staffs, message: "Staffs fetched successfully" })
        }
        catch (error) {
            next(error)
        }
    }
    async onGetStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const staffId = parseInt(req.params.id)
            const staff = await this.staffInteractor.getStaff(staffId)
            res.status(200).json({ status: "success", data: staff, message: "Staff fetched successfully" })
        }
        catch (error) {
            next(error)
        }
    }
    async onUpdateStaff(req: Request, res: Response, next: NextFunction) {
        try {
            const staffId = parseInt(req.params.id)
            const staff = req.body

            const updatedStaff = await this.staffInteractor.updateStaff(staffId, staff)
            res.status(200).json({ status: "success", data: updatedStaff, message: "Staff updated successfully" })
        }
        catch (error) {
            next(error)
        }
    }
}