import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IRoleInteractor } from "../../interfaces/administation/IRoleInteracter";

@injectable()
export class RoleController {
    private roleInteractor: IRoleInteractor
    constructor(@inject(INTERFACE_TYPE.RoleInteractor) roleInteractor: IRoleInteractor) {
        this.roleInteractor = roleInteractor
    }
    async onCreateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const role = req.body
            const createdRole = await this.roleInteractor.createRole(role)
            res.status(201).json({ status: "success", data: createdRole, message: "Role created successfully" })

        } catch (error) {
            next(error)

        }
    }
    async onGetRoles(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 10
            const roles = await this.roleInteractor.getRoles(limit, offset)
            res.status(200).json({ status: "success", data: roles, message: "Roles fetched successfully" })
        } catch (error) {
            next(error)
        }
    }
    async onGetRole(req: Request, res: Response, next: NextFunction) {
        try {
            const roleId = parseInt(req.params.roleId)
            const role = await this.roleInteractor.getRole(roleId)
            res.status(200).json({ status: "success", data: role, message: "Role fetched successfully" })
        } catch (error) {
            next(error)
        }
    }
    async onUpdateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const roleId = parseInt(req.params.roleId)
            const role = req.body
            const updatedRole = await this.roleInteractor.updateRole(roleId, role)
            res.status(200).json({ status: "success", data: updatedRole, message: "Role updated successfully" })
        } catch (error) {
            next(error)
        }
    }
}
