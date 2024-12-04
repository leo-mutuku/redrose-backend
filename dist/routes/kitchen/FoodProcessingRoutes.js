"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const FoodProcessingRepository_1 = require("../../repositories/kitchen/FoodProcessingRepository");
const FoodProcessingInteractor_1 = require("../../interactors/kitchen/FoodProcessingInteractor");
const FoodProcessingController_1 = require("../../controllers/kitchen/FoodProcessingController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind FoodProcessing-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.FoodProcessingRepository).to(FoodProcessingRepository_1.FoodProcessingRepository);
container.bind(utils_1.INTERFACE_TYPE.FoodProcessingInteractor).to(FoodProcessingInteractor_1.FoodProcessingInteractor);
container.bind(utils_1.INTERFACE_TYPE.FoodProcessingController).to(FoodProcessingController_1.FoodProcessingController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.FoodProcessingController);
// Define the routes and bind controller methods
router.post("/createfoodprocessing", controller.onCreateFoodProcessing.bind(controller));
router.get("/getfoodprocessing/:id", controller.onGetFoodProcessing.bind(controller));
router.get("/getfoodprocessings", controller.onGetFoodProcessings.bind(controller));
router.patch("/updatefoodprocessing/:id", controller.onUpdateFoodProcessing.bind(controller));
// Export the configured router
exports.default = router;
