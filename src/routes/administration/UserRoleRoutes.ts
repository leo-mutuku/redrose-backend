import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IUserRoleRepository } from "../../interfaces/administation/IUserRoleRepository";
import { IUserRoleInteractor } from "../../interfaces/administation/IUserRoleInteractor";
import { UserRoleInteractor } from "../../interactors/administration/UserRoleInteractor";
import { UserRoleController } from "../../controllers/administration/UserRoleController";
import { UserRoleRepository } from "../../repositories/administration/UserRolerepository";


const container = new Container();
container.bind<IUserRoleRepository>(INTERFACE_TYPE.UserRoleRepository).to(UserRoleRepository)
container.bind<IUserRoleInteractor>(INTERFACE_TYPE.UserRoleInteractor).to(UserRoleInteractor)
container.bind<UserRoleController>(INTERFACE_TYPE.UserRoleController).to(UserRoleController)

const router = Router();
const controller = container.get<UserRoleController>(INTERFACE_TYPE.UserRoleController)
router.patch("/assignroles/:id", controller.onAssignUserRoles.bind(controller))
router.patch("/unassignroles/:id", controller.onUnassignUserRoles.bind(controller))

export default router;