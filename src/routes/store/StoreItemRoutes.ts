import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStoreItemRepository } from "../../interfaces/store/IStoreItemRepository";
import { IStoreItemInteractor } from "../../interfaces/store/IStoreItemInteractor";
import { StoreItemRepository } from "../../repositories/store/StoreItemRepository";
import { StoreItemInteractor } from "../../interactors/store/StoreItemInteractor";
import { StoreItemController } from "../../controllers/store/StoreItemController";


// Initialize Inversify container
const container = new Container();

// Bind Item-related interfaces to their implementations
container.bind<IStoreItemRepository>(INTERFACE_TYPE.StoreItemRepository).to(StoreItemRepository);
container.bind<IStoreItemInteractor>(INTERFACE_TYPE.StoreItemInteractor).to(StoreItemInteractor);
container.bind(INTERFACE_TYPE.StoreItemController).to(StoreItemController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<StoreItemController>(INTERFACE_TYPE.StoreItemController);

// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateStoreItem.bind(controller));
router.get("/getitem/:id", controller.onGetStoreItem.bind(controller));
router.get("/getitems", controller.onGetStoreItems.bind(controller));  // Example for listing items with pagination
router.patch("/updateitem/:id", controller.onUpdateStoreItem.bind(controller));
router.delete("/deleteitem/:id", controller.onDeleteStoreItem.bind(controller));
router.get("/itemtracking", controller.onGetItemtracking.bind(controller))
// Export the configured router
export default router;
