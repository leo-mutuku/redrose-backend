import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { KitchenSetupRepository } from "../../repositories/kitchen/KitchenSetupRepository";
import { KitchenSetupInteractor } from "../../interactors/kitchen/KitchenSetupInteractor";
import { IKitchenSetupInteractor } from "../../interfaces/kitchen/IKitchenSetupInteractor";
import { KitchenSetupController } from "../../controllers/kitchen/KitchenSetupController";
import { IKitchenSetupRepository } from "../../interfaces/kitchen/IKitchenSetupRepository";

// Initialize Inversify container
const container = new Container();

// Bind KitchenSetup-related interfaces to their implementations
container.bind<IKitchenSetupRepository>(INTERFACE_TYPE.KitchenSetupRepository).to(KitchenSetupRepository);
container.bind<IKitchenSetupInteractor>(INTERFACE_TYPE.KitchenSetupInteractor).to(KitchenSetupInteractor);
container.bind(INTERFACE_TYPE.KitchenSetupController).to(KitchenSetupController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<KitchenSetupController>(INTERFACE_TYPE.KitchenSetupController);

// Define the routes and bind controller methods
router.post("/createkitchensetup", controller.onCreateKitchenSetup.bind(controller));
router.get("/getkitchensetup/:id", controller.onGetKitchenSetup.bind(controller));
router.get("/getkitchensetups", controller.onGetKitchenSetups.bind(controller));
router.patch("/updatekitchensetup/:id", controller.onUpdateKitchenSetup.bind(controller));
router.delete("/deletekitchensetup/:id", controller.onDeleteKitchenSetup.bind(controller));

// Export the configured router
export default router;
