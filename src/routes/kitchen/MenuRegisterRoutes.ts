import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuRegisterRepository } from "../../interfaces/store/IMenuRegisterRepository";
import { IMenuRegisterInteractor } from "../../interfaces/store/IMenuRegisterInteractor";
import { MenuRegisterInteractor } from "../../interactors/store/MenuRegisterInteractor";
import { MenuRegisterRepository } from "../../repositories/store/MenuRegisterRepository";
import { MenuRegisterController } from "../../controllers/store/MenuRegisterController";

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
router.post("/createmenu", controller.onCreateMenu.bind(controller));
router.get("/getmenu/:id", controller.onGetMenu.bind(controller));
router.get("/getmenus", controller.onGetMenus.bind(controller));
router.patch("/updatemenu/:id", controller.onUpdateMenu.bind(controller));

// Export the configured router
export default router;
