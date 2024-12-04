"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const WaitStaffRegisterRepository_1 = require("../../repositories/sales/WaitStaffRegisterRepository");
const WaitStaffRegisterInteractor_1 = require("../../interactors/sales/WaitStaffRegisterInteractor");
const WaitStaffRegisterController_1 = require("../../controllers/sales/WaitStaffRegisterController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind WaitStaffRegister-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.WaitStaffRegisterRepository).to(WaitStaffRegisterRepository_1.WaitStaffRegisterRepository);
container.bind(utils_1.INTERFACE_TYPE.WaitStaffRegisterInteractor).to(WaitStaffRegisterInteractor_1.WaitStaffRegisterInteractor);
container.bind(utils_1.INTERFACE_TYPE.WaitStaffRegisterController).to(WaitStaffRegisterController_1.WaitStaffRegisterController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.WaitStaffRegisterController);
// Define the routes and bind controller methods
router.post("/createwaitstaffregister", controller.onCreateWaitStaffRegister.bind(controller));
router.get("/getwaitstaffregister/:id", controller.onGetWaitStaffRegister.bind(controller));
router.get("/getwaitstaffregisters", controller.onGetWaitStaffRegisters.bind(controller));
router.patch("/updatewaitstaffregister/:id", controller.onUpdateWaitStaffRegister.bind(controller));
// Export the configured router
exports.default = router;
