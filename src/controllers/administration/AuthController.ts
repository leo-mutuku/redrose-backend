import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAuthInteractor } from "../../interfaces/administation/IAuthInteractor";
import { INTERFACE_TYPE } from "../../utils";


@injectable()
export class AuthController {
    private authInteractor: IAuthInteractor;
    constructor(@inject(INTERFACE_TYPE.AuthInteractor) authInteractor: IAuthInteractor) {
        this.authInteractor = authInteractor;
    }

    async onLogin(req: Request, res: Response, next: NextFunction) {
        try {

            const body = req.body;
            const result = await this.authInteractor.login(body);

            // Send token in the Authorization header
            const token = result.token;

            // Set the token in the Authorization header
            res.setHeader("Authorization", `Bearer ${token}`);

            // Return the result along with a success message
            res.json({
                status: "success",
                data: result,
                message: "Login successful"
            });
        } catch (error) {
            next(error)

        }


    }

    async onForgotPassword(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        const result = await this.authInteractor.forgotPassword(body)
        res.json({ status: "success", data: result, message: "Password reset successful" })
    }

    async onResetPassword(req: Request, res: Response, next: NextFunction) {
        const body = req.body
        const result = await this.authInteractor.resetPassword(body)
        res.json({ status: "success", data: result, message: "Password reset successful" })
    }
}
