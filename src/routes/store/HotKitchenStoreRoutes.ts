import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { HotKitchenStoreRepository } from "../../repositories/store/HotKitchenStoreRepository";
import { HotKitchenStoreInteractor } from "../../interactors/store/HotKitchenStoreInteractor";
import { HotKitchenStoreController } from "../../controllers/store/HotKitchenStoreController";
import { IHotKitchenStoreRepository } from "../../interfaces/store/IHotKitchenStoreRepository";
import { IHotKitchenStoreInteractor } from "../../interfaces/store/IHotKitchenStoreInteractor";

// Initialize Inversify container
const container = new Container();

// Bind HotKitchenStore-related interfaces to their implementations
container.bind<IHotKitchenStoreRepository>(INTERFACE_TYPE.HotKitchenStoreRepository).to(HotKitchenStoreRepository);
container.bind<IHotKitchenStoreInteractor>(INTERFACE_TYPE.HotKitchenStoreInteractor).to(HotKitchenStoreInteractor);
container.bind(INTERFACE_TYPE.HotKitchenStoreController).to(HotKitchenStoreController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<HotKitchenStoreController>(INTERFACE_TYPE.HotKitchenStoreController);

// Define the routes and bind controller methods
router.post("/createhotkitchenstore", controller.onCreateHotKitchenStore.bind(controller));
router.get("/gethotkitchenstore/:id", controller.onGetHotKitchenStore.bind(controller));
router.get("/gethotkitchenstores", controller.onGetHotKitchenStores.bind(controller));
router.patch("/updatehotkitchenstore/:id", controller.onUpdateHotKitchenStore.bind(controller));
router.get("/getkitchentracking", controller.onKitchenTracking.bind(controller));
router.delete("/deletehotkitchenstore/:id", controller.onDeleteHotKitchenStore.bind(controller));

// Export the configured router
export default router;
