import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AuthController } from "../../controllers/administration/AuthController";
import { AuthRepository } from "../../repositories/administration/AuthRepository";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";
import { IAuthInteractor } from "../../interfaces/administation/IAuthInteractor";
import { AuthInteractor } from "../../interactors/administration/AuthInteractor";


const container = new Container

container.bind<IAuthRepository>(INTERFACE_TYPE.AuthRepository).to(AuthRepository)
container.bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractor).to(AuthInteractor)
container.bind<AuthController>(INTERFACE_TYPE.AuthController).to(AuthController)


const router = Router();
const controller = container.get<AuthController>(INTERFACE_TYPE.AuthController)

router.post("/login", controller.onLogin.bind(controller));

router.post("/resetpassword", controller.onResetPassword.bind(controller));
router.post("/forgotpassword", controller.onForgotPassword.bind(controller));

export default router;
