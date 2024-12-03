import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { MenuUnitRepository } from "../../repositories/kitchen/MenuUnitReposity";
import { IMenuUnitRepository } from "../../interfaces/kitchen/IMenuUnitRepository";
import { IMenuUnitInteractor } from "../../interfaces/kitchen/ImenuUnitInteractor";
import { MenuUnitInteractor } from "../../interactors/kitchen/MenuUnitInteractor";
import { MenuUnitController } from "../../controllers/kitchen/MenuUnitController";


// Initialize Inversify container
const container = new Container();

// Bind MenuUnits-related interfaces to their implementations
container.bind<IMenuUnitRepository>(INTERFACE_TYPE.MenuUnitRepository).to(MenuUnitRepository);
container.bind<IMenuUnitInteractor>(INTERFACE_TYPE.MenuUnitInteractor).to(MenuUnitInteractor);
container.bind(INTERFACE_TYPE.MenuUnitController).to(MenuUnitController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<MenuUnitController>(INTERFACE_TYPE.MenuUnitController);

// Define the routes and bind controller methods
router.post("/createmenuunit", controller.onCreateMenuUnit.bind(controller));
router.get("/getmenuunit/:id", controller.onGetMenuUnit.bind(controller));
router.get("/getmenuunits", controller.onGetMenuUnits.bind(controller));
router.patch("/updatemenuunit/:id", controller.onUpdateMenuUnit.bind(controller));

// Export the configured router
export default router;
