"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const UnitController_1 = require("../../controllers/store/UnitController");
const UnitRepository_1 = require("../../repositories/store/UnitRepository");
const UnitInteractor_1 = require("../../interactors/store/UnitInteractor");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Unit-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.UnitRepository).to(UnitRepository_1.UnitRepository);
container.bind(utils_1.INTERFACE_TYPE.UnitInteractor).to(UnitInteractor_1.UnitInteractor);
container.bind(utils_1.INTERFACE_TYPE.UnitController).to(UnitController_1.UnitController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.UnitController);
// Define the routes and bind controller methods
router.post("/createunit", controller.onCreateUnit.bind(controller));
router.get("/getunit/:id", controller.onGetUnit.bind(controller));
router.get("/getunits", controller.onGetUnits.bind(controller));
router.patch("/updateunit/:id", controller.onUpdateUnit.bind(controller));
// Export the configured router
exports.default = router;
