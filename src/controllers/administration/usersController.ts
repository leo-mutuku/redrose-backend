import { NextFunction, Request, Response } from "express";
import { IUserInteractor } from "../../interfaces/administation/IUserInteractor";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";

@injectable()
export class UserController {
    private interactor: IUserInteractor
    constructor(@inject(INTERFACE_TYPE.UserInteractor) interactor: IUserInteractor) {
        this.interactor = interactor
    }
    async onCreateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body

            const data = await this.interactor.createUser(body)
            res.status(201).json({ status: 'success', data: data, message: 'User created successfully' })
        } catch (error) {
            next(error)
        }
    }
    async onGetUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const offset = parseInt(req.query.offset as string) || 0
            const limit = parseInt(req.query.limit as string) || 10

            const data = await this.interactor.getUsers(limit, offset)
            res.status(200).json({ status: 'success', data: data, message: 'Users fetched successfully' })
        } catch (error) {
            next(error)
        }
    }
    async onGetUser(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('get user', req.body.user)
            console.log(req.params.id)
            const id = parseInt(req.params.id)
            const data = await this.interactor.getUser(id)
            res.status(200).json({ status: 'success', data: data, message: 'User fetched successfully' })
        } catch (error) {
            next(error)
        }
    }
    async onUpdateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id)
            const body = req.body
            const data = await this.interactor.updateUser(id, body)
            res.status(200).json({ status: 'success', data: data, message: 'User updated successfully' })
        } catch (error) {
            next(error)
        }
    }
    async onChangePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user_id = parseInt(req.body.user.userId)
            const password = req.body.new_password
            const old_password = req.body.old_password
            const body = { user_id, password, old_password }
            const data = await this.interactor.changePassword(body)
            res.status(200).json({
                status: "success",
                message: "Passord changed successfully",
                data: data
            })
        } catch (error) {
            next(error)
        }
    }
}