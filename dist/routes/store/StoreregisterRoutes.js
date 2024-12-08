"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const StoreRegisterInteractor_1 = require("../../interactors/store/StoreRegisterInteractor");
const StoreregisterController_1 = require("../../controllers/store/StoreregisterController");
const StoreRegisterRepository_1 = require("../../repositories/store/StoreRegisterRepository");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind StoreRegister-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.StoreRegisterRepository).to(StoreRegisterRepository_1.StoreRegisterRepository);
container.bind(utils_1.INTERFACE_TYPE.StoreRegisterInteractor).to(StoreRegisterInteractor_1.StoreRegisterInteractor);
container.bind(utils_1.INTERFACE_TYPE.StoreRegisterController).to(StoreregisterController_1.StoreRegisterController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.StoreRegisterController);
// Define the routes and bind controller methods
router.post("/createstore", controller.onCreateRegister.bind(controller));
router.get("/getstore/:id", controller.onGetRegister.bind(controller));
router.get("/getstores", controller.onGetRegisters.bind(controller));
router.patch("/updatestore/:id", controller.onUpdateRegister.bind(controller));
// Export the configured router
exports.default = router;
