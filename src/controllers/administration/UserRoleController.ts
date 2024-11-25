import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IUserRoleInteractor } from "../../interfaces/administation/IUserRoleInteractor";

@injectable()
export class UserRoleController {
    private userRoleInteractor: IUserRoleInteractor
    constructor(@inject(INTERFACE_TYPE.UserRoleInteractor) userRoleInteractor: IUserRoleInteractor) {
        this.userRoleInteractor = userRoleInteractor
    }
    async onAssignUserRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const body = req.body
            const data = await this.userRoleInteractor.assignUserRoles(id, body)
            res.status(201).json({ status: 'success', data: data, message: 'UserRole created successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetUserRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 10
            const data = await this.userRoleInteractor.getUserRoles(limit, offset)
            res.status(200).json({ status: 'success', data: data, message: 'UserRoles fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onGetUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const data = await this.userRoleInteractor.getUserRole(id)
            res.status(200).json({ status: 'success', data: data, message: 'UserRole fetched successfully' });
        }
        catch (error) {
            next(error)
        }
    }
    async onUpdateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const body = req.body
            const data = await this.userRoleInteractor.updateUserRole(id, body)
            res.status(200).json({ status: 'success', data: data, message: 'UserRole updated successfully' });
        }
        catch (error) {
            next(error)
        }
    }
}