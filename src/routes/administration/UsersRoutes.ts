import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IUserRepository } from "../../interfaces/administation/IUserRepository";
import { UserRepository } from "../../repositories/administration/UserRepository";
import { IUserInteractor } from "../../interfaces/administation/IUserInteractor";
import { UserInteractor } from "../../interactors/administration/UserInteractor";
import { UserController } from "../../controllers/administration/UsersController";


const container = new Container

container.bind<IUserRepository>(INTERFACE_TYPE.UserRepository).to(UserRepository)
container.bind<IUserInteractor>(INTERFACE_TYPE.UserInteractor).to(UserInteractor)
container.bind(INTERFACE_TYPE.UserController).to(UserController)



const router = Router();
const controller = container.get<UserController>(INTERFACE_TYPE.UserController)

router.post("/createuser", controller.onCreateUser.bind(controller));
router.get("/getuser/:id", controller.onGetUser.bind(controller));
router.get("/getusers", controller.onGetUsers.bind(controller));
router.put("/:id", controller.onUpdateUser.bind(controller));
export default router;
