import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { MenuItemRepository } from "../../repositories/kitchen/MenuItemRepository";
import { MenuItemInteractor } from "../../interactors/kitchen/MenuItemInteractors";
import { IMenuItemRepository } from "../../interfaces/kitchen/IMenuItemRepository";
import { IMenuItemInteractor } from "../../interfaces/kitchen/IMenuItemInteractor";
import { MenuItemController } from "../../controllers/kitchen/MenuItemController";


// Initialize Inversify container
const container = new Container();

// Bind Menu Item-related interfaces to their implementations
container.bind<IMenuItemRepository>(INTERFACE_TYPE.MenuItemRepository).to(MenuItemRepository);
container.bind<IMenuItemInteractor>(INTERFACE_TYPE.MenuItemInteractor).to(MenuItemInteractor);
container.bind(INTERFACE_TYPE.MenuItemController).to(MenuItemController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<MenuItemController>(INTERFACE_TYPE.MenuItemController);

// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateMenu.bind(controller));
router.get("/getitem/:id", controller.onGetMenuItem.bind(controller));
router.get("/getitems", controller.onGetMenuItemRegisters.bind(controller));
router.patch("/updateitem/:id", controller.onUpdateMenuItem.bind(controller));

// Export the configured router
export default router;
