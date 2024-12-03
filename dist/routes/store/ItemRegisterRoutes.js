"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const ItemRegisterInteractor_1 = require("../../interactors/store/ItemRegisterInteractor");
const ItemRegisterRepository_1 = require("../../repositories/store/ItemRegisterRepository");
const ItemRegisterController_1 = require("../../controllers/store/ItemRegisterController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Item Register-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.ItemRegisterRepository).to(ItemRegisterRepository_1.ItemRegisterRepository);
container.bind(utils_1.INTERFACE_TYPE.ItemRegisterInteractor).to(ItemRegisterInteractor_1.ItemRegisterInteractor);
container.bind(utils_1.INTERFACE_TYPE.ItemRegisterController).to(ItemRegisterController_1.ItemRegisterController); // Adjusted controller binding
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.ItemRegisterController);
// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateRegister.bind(controller)); // Adjusted route
router.get("/getitem/:id", controller.onGetRegister.bind(controller)); // Adjusted route
router.get("/getitems", controller.onGetRegisters.bind(controller)); // Adjusted route
router.patch("/updateitem/:id", controller.onUpdateRegister.bind(controller)); // Adjusted route
// Export the configured router
exports.default = router;
