import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { FoodProcessingRepository } from "../../repositories/kitchen/FoodProcessingRepository";
import { FoodProcessingInteractor } from "../../interactors/kitchen/FoodProcessingInteractor";
import { FoodProcessingController } from "../../controllers/kitchen/FoodProcessingController";
import { IFoodProcessingRepository } from "../../interfaces/kitchen/IFoodProcessingRepository";
import { IFoodProcessingInteractor } from "../../interfaces/kitchen/IFoodProcessingInteractor";

// Initialize Inversify container
const container = new Container();

// Bind FoodProcessing-related interfaces to their implementations
container.bind<IFoodProcessingRepository>(INTERFACE_TYPE.FoodProcessingRepository).to(FoodProcessingRepository);
container.bind<IFoodProcessingInteractor>(INTERFACE_TYPE.FoodProcessingInteractor).to(FoodProcessingInteractor);
container.bind(INTERFACE_TYPE.FoodProcessingController).to(FoodProcessingController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<FoodProcessingController>(INTERFACE_TYPE.FoodProcessingController);

// Define the routes and bind controller methods
router.post("/createfoodprocessing", controller.onCreateFoodProcessing.bind(controller));
router.get("/getfoodprocessing/:id", controller.onGetFoodProcessing.bind(controller));
router.get("/getfoodprocessings", controller.onGetFoodProcessings.bind(controller));
router.patch("/updatefoodprocessing/:id", controller.onUpdateFoodProcessing.bind(controller));

// Export the configured router
export default router;
