import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { MenuCategoryRepository } from "../../repositories/kitchen/MenuCategoryRepository";
import { MenuCategoryInteractor } from "../../interactors/kitchen/MenuCategoryInteractor";
import { MenuCategoryController } from "../../controllers/kitchen/MenuCategoryController";
import { IMenuCategoryRepository } from "../../interfaces/kitchen/IMenuCategoryRepository";
import { IMenuCategoryInteractor } from "../../interfaces/kitchen/IMenuCategoryInteractor";

// Initialize Inversify container
const container = new Container();

// Bind MenuCategory-related interfaces to their implementations
container.bind<IMenuCategoryRepository>(INTERFACE_TYPE.MenuCategoryRepository).to(MenuCategoryRepository);
container.bind<IMenuCategoryInteractor>(INTERFACE_TYPE.MenuCategoryInteractor).to(MenuCategoryInteractor);
container.bind(INTERFACE_TYPE.MenuCategoryController).to(MenuCategoryController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<MenuCategoryController>(INTERFACE_TYPE.MenuCategoryController);

// Define the routes and bind controller methods
router.post("/createmenucategory", controller.onCreateMenuCategory.bind(controller));
router.get("/getmenucategory/:id", controller.onGetMenuCategory.bind(controller));
router.get("/getmenucategories", controller.onGetMenuCategories.bind(controller));
router.patch("/updatemenucategory/:id", controller.onUpdateMenuCategory.bind(controller));

// Export the configured router
export default router;
