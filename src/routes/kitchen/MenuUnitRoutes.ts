import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { MenuUnitsRepository } from "../../repositories/store/MenuUnitsRepository";
import { MenuUnitsInteractor } from "../../interactors/store/MenuUnitsInteractor";
import { MenuUnitsController } from "../../controllers/store/MenuUnitsController";
import { IMenuUnitsRepository } from "../../interfaces/store/IMenuUnitsRepository";
import { IMenuUnitsInteractor } from "../../interfaces/store/IMenuUnitsInteractor";

// Initialize Inversify container
const container = new Container();

// Bind MenuUnits-related interfaces to their implementations
container.bind<IMenuUnitsRepository>(INTERFACE_TYPE.MenuUnitsRepository).to(MenuUnitsRepository);
container.bind<IMenuUnitsInteractor>(INTERFACE_TYPE.MenuUnitsInteractor).to(MenuUnitsInteractor);
container.bind(INTERFACE_TYPE.MenuUnitsController).to(MenuUnitsController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<MenuUnitsController>(INTERFACE_TYPE.MenuUnitsController);

// Define the routes and bind controller methods
router.post("/createmenuunit", controller.onCreateMenuUnit.bind(controller));
router.get("/getmenuunit/:id", controller.onGetMenuUnit.bind(controller));
router.get("/getmenuunits", controller.onGetMenuUnits.bind(controller));
router.patch("/updatemenuunit/:id", controller.onUpdateMenuUnit.bind(controller));

// Export the configured router
export default router;
