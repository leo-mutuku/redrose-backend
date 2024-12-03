import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { MenuRegisterRepository } from "../../repositories/kitchen/MenuRegisterRepository";
import { MenuRegisterInteractor } from "../../interactors/kitchen/MenuRegisterInteractor";
import { MenuRegisterController } from "../../controllers/kitchen/MenuRegisterController";
import { IMenuRegisterRepository } from "../../interfaces/kitchen/IMenuRegisterRepository";
import { IMenuRegisterInteractor } from "../../interfaces/kitchen/IMenuRegisterInteractor";


// Initialize Inversify container
const container = new Container();

// Bind Menu Register-related interfaces to their implementations
container.bind<IMenuRegisterRepository>(INTERFACE_TYPE.MenuRegisterRepository).to(MenuRegisterRepository);
container.bind<IMenuRegisterInteractor>(INTERFACE_TYPE.MenuRegisterInteractor).to(MenuRegisterInteractor);
container.bind(INTERFACE_TYPE.MenuRegisterController).to(MenuRegisterController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<MenuRegisterController>(INTERFACE_TYPE.MenuRegisterController);

// Define the routes and bind controller methods
router.post("/createmenu", controller.onCreateMenuRegister.bind(controller));
router.get("/getmenu/:id", controller.onGetMenuRegister.bind(controller));
router.get("/getmenus", controller.onGetMenuRegisters.bind(controller));
router.patch("/updatemenu/:id", controller.onUpdateMenuRegister.bind(controller));

// Export the configured router
export default router;
