import { NextFunction, Request, Response } from "express";

export class AuthController {

    async onLogin(req: Request, res: Response, next: NextFunction) {
        const body = req.body


    }

    async onRegister(req: Request, res: Response, next: NextFunction) {

    }

    async onForgotPassword(req: Request, res: Response, next: NextFunction) { }


    async onResetPassword(req: Request, res: Response, next: NextFunction) { }


}