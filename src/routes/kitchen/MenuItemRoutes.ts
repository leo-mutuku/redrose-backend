import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMenuItemRepository } from "../../interfaces/store/IMenuItemRepository";
import { IMenuItemInteractor } from "../../interfaces/store/IMenuItemInteractor";
import { MenuItemInteractor } from "../../interactors/store/MenuItemInteractor";
import { MenuItemRepository } from "../../repositories/store/MenuItemRepository";
import { MenuItemController } from "../../controllers/store/MenuItemController";

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
router.post("/createitem", controller.onCreateItem.bind(controller));
router.get("/getitem/:id", controller.onGetItem.bind(controller));
router.get("/getitems", controller.onGetItems.bind(controller));
router.patch("/updateitem/:id", controller.onUpdateItem.bind(controller));

// Export the configured router
export default router;
