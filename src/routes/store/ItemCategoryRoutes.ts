import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ItemCategoryRepository } from "../../repositories/store/ItemCategoryRepository";
import { ItemCategoryInteractor } from "../../interactors/store/ItemCategoryInteractor";
import { ItemCategoryController } from "../../controllers/store/ItemCategoryController";
import { IItemCategoryRepository } from "../../interfaces/store/IItemCategoryRepository";
import { IItemCategoryInteractor } from "../../interfaces/store/IItemcategoryInteractor";


// Initialize Inversify container
const container = new Container();

// Bind ItemCategory-related interfaces to their implementations
container.bind<IItemCategoryRepository>(INTERFACE_TYPE.ItemCategoryRepository).to(ItemCategoryRepository);
container.bind<IItemCategoryInteractor>(INTERFACE_TYPE.ItemCategoryInteractor).to(ItemCategoryInteractor);
container.bind(INTERFACE_TYPE.ItemCategoryController).to(ItemCategoryController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<ItemCategoryController>(INTERFACE_TYPE.ItemCategoryController);

// Define the routes and bind controller methods
router.post("/createitemcategory", controller.onCreateItemCategory.bind(controller));
router.get("/getitemcategory/:id", controller.onGetItemCategory.bind(controller));
router.get("/getitemcategories", controller.onGetItemCategories.bind(controller));
router.patch("/updateitemcategory/:id", controller.onUpdateItemCategory.bind(controller));

// Export the configured router
export default router;
