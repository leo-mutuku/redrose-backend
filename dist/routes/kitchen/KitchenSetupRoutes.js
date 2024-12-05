"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const KitchenSetupRepository_1 = require("../../repositories/kitchen/KitchenSetupRepository");
const KitchenSetupInteractor_1 = require("../../interactors/kitchen/KitchenSetupInteractor");
const KitchenSetupController_1 = require("../../controllers/kitchen/KitchenSetupController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind KitchenSetup-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.KitchenSetupRepository).to(KitchenSetupRepository_1.KitchenSetupRepository);
container.bind(utils_1.INTERFACE_TYPE.KitchenSetupInteractor).to(KitchenSetupInteractor_1.KitchenSetupInteractor);
container.bind(utils_1.INTERFACE_TYPE.KitchenSetupController).to(KitchenSetupController_1.KitchenSetupController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.KitchenSetupController);
// Define the routes and bind controller methods
router.post("/createkitchensetup", controller.onCreateKitchenSetup.bind(controller));
router.get("/getkitchensetup/:id", controller.onGetKitchenSetup.bind(controller));
router.get("/getkitchensetups", controller.onGetKitchenSetups.bind(controller));
router.patch("/updatekitchensetup/:id", controller.onUpdateKitchenSetup.bind(controller));
// Export the configured router
exports.default = router;
