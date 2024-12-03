import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { KitchenStationRepository } from "../../repositories/kitchen/KitchenStationRepository";
import { KitchenStationInteractor } from "../../interactors/kitchen/KitchenStationInteractor";
import { KitchenStationController } from "../../controllers/kitchen/KitchenStationController";
import { IKitchenStationRepository } from "../../interfaces/kitchen/IKitchenStationRepository";
import { IKitchenStationInteractor } from "../../interfaces/kitchen/IKitchenStationInteractor";

// Initialize Inversify container
const container = new Container();

// Bind KitchenStation-related interfaces to their implementations
container.bind<IKitchenStationRepository>(INTERFACE_TYPE.KitchenStationRepository).to(KitchenStationRepository);
container.bind<IKitchenStationInteractor>(INTERFACE_TYPE.KitchenStationInteractor).to(KitchenStationInteractor);
container.bind(INTERFACE_TYPE.KitchenStationController).to(KitchenStationController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<KitchenStationController>(INTERFACE_TYPE.KitchenStationController);

// Define the routes and bind controller methods
router.post("/createkitchenstation", controller.onCreateKitchenStation.bind(controller));
router.get("/getkitchenstation/:id", controller.onGetKitchenStation.bind(controller));
router.get("/getkitchenstations", controller.onGetKitchenStations.bind(controller));
router.patch("/updatekitchenstation/:id", controller.onUpdateKitchenStation.bind(controller));

// Export the configured router
export default router;
