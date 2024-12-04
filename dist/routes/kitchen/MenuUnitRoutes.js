"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const MenuUnitReposity_1 = require("../../repositories/kitchen/MenuUnitReposity");
const MenuUnitInteractor_1 = require("../../interactors/kitchen/MenuUnitInteractor");
const MenuUnitController_1 = require("../../controllers/kitchen/MenuUnitController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind MenuUnits-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.MenuUnitRepository).to(MenuUnitReposity_1.MenuUnitRepository);
container.bind(utils_1.INTERFACE_TYPE.MenuUnitInteractor).to(MenuUnitInteractor_1.MenuUnitInteractor);
container.bind(utils_1.INTERFACE_TYPE.MenuUnitController).to(MenuUnitController_1.MenuUnitController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.MenuUnitController);
// Define the routes and bind controller methods
router.post("/createmenuunit", controller.onCreateMenuUnit.bind(controller));
router.get("/getmenuunit/:id", controller.onGetMenuUnit.bind(controller));
router.get("/getmenuunits", controller.onGetMenuUnits.bind(controller));
router.patch("/updatemenuunit/:id", controller.onUpdateMenuUnit.bind(controller));
// Export the configured router
exports.default = router;
