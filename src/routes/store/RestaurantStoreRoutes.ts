import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { RestaurantStoreRepository } from "../../repositories/store/RestaurantStoreRepository";
import { RestaurantStoreInteractor } from "../../interactors/store/RestaurantStoreInteractor";
import { RestaurantStoreController } from "../../controllers/store/RestaurantStoreController";
import { IRestaurantStoreRepository } from "../../interfaces/store/IRestaurantStoreRepository";
import { IRestaurantStoreInteractor } from "../../interfaces/store/IRestaurantStoreInteractor";

// Initialize Inversify container
const container = new Container();

// Bind RestaurantStore-related interfaces to their implementations
container.bind<IRestaurantStoreRepository>(INTERFACE_TYPE.RestaurantStoreRepository).to(RestaurantStoreRepository);
container.bind<IRestaurantStoreInteractor>(INTERFACE_TYPE.RestaurantStoreInteractor).to(RestaurantStoreInteractor);
container.bind(INTERFACE_TYPE.RestaurantStoreController).to(RestaurantStoreController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<RestaurantStoreController>(INTERFACE_TYPE.RestaurantStoreController);

// Define the routes and bind controller methods
router.post("/createrestaurantstore", controller.onCreateRestaurantStore.bind(controller));
router.get("/getrestaurantstore/:id", controller.onGetRestaurantStore.bind(controller));
router.get("/getrestaurantstores", controller.onGetRestaurantStores.bind(controller));
router.patch("/updaterestaurantstore/:id", controller.onUpdateRestaurantStore.bind(controller));
router.get("/getrestauranttracking", controller.onRestaurantTracking.bind(controller));
router.delete("/deleterestaurantstore/:id", controller.onDeleteRestaurantStore.bind(controller));

// Export the configured router
export default router;
