"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const KitchenStationRepository_1 = require("../../repositories/kitchen/KitchenStationRepository");
const KitchenStationInteractor_1 = require("../../interactors/kitchen/KitchenStationInteractor");
const KitchenStationController_1 = require("../../controllers/kitchen/KitchenStationController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind KitchenStation-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.KitchenStationRepository).to(KitchenStationRepository_1.KitchenStationRepository);
container.bind(utils_1.INTERFACE_TYPE.KitchenStationInteractor).to(KitchenStationInteractor_1.KitchenStationInteractor);
container.bind(utils_1.INTERFACE_TYPE.KitchenStationController).to(KitchenStationController_1.KitchenStationController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.KitchenStationController);
// Define the routes and bind controller methods
router.post("/createkitchenstation", controller.onCreateKitchenStation.bind(controller));
router.get("/getkitchenstation/:id", controller.onGetKitchenStation.bind(controller));
router.get("/getkitchenstations", controller.onGetKitchenStations.bind(controller));
router.patch("/updatekitchenstation/:id", controller.onUpdateKitchenStation.bind(controller));
// Export the configured router
exports.default = router;
