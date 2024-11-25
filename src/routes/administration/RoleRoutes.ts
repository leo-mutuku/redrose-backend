import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IRoleRepository } from "../../interfaces/administation/IRoleRepository";
import { RoleRepository } from "../../repositories/administration/RoleRepository";
import { IRoleInteractor } from "../../interfaces/administation/IRoleInteracter";
import { RoleInteractor } from "../../interactors/administration/RoleInteractor";
import { RoleController } from "../../controllers/administration/RoleController";


const container = new Container();
container.bind<IRoleRepository>(INTERFACE_TYPE.RoleRepository).to(RoleRepository);
container.bind<IRoleInteractor>(INTERFACE_TYPE.RoleInteractor).to(RoleInteractor);
container.bind<RoleController>(INTERFACE_TYPE.RoleController).to(RoleController);

const router = Router();
const controller = container.get<RoleController>(INTERFACE_TYPE.RoleController);
router.post('/createrole', controller.onCreateRole.bind(controller));
router.get('/getroles', controller.onGetRoles.bind(controller));
router.get('/getrole/:id', controller.onGetRole.bind(controller));
router.patch('/updateRole/:id', controller.onUpdateRole.bind(controller));


export default router;