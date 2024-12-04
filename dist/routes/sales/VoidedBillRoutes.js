"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const VoidedBillInteractor_1 = require("../../interactors/sales/VoidedBillInteractor");
const VoidedBillController_1 = require("../../controllers/sales/VoidedBillController");
const VoidedBillRepositories_1 = require("../../repositories/sales/VoidedBillRepositories");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind VoidedBill-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.VoidedBillRepository).to(VoidedBillRepositories_1.VoidedBillRepository);
container.bind(utils_1.INTERFACE_TYPE.VoidedBillInteractor).to(VoidedBillInteractor_1.VoidedBillInteractor);
container.bind(utils_1.INTERFACE_TYPE.VoidedBillController).to(VoidedBillController_1.VoidedBillController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.VoidedBillController);
// Define the routes and bind controller methods
router.post("/createvoidedbill", controller.onCreateVoidedBill.bind(controller));
router.get("/getvoidedbill/:id", controller.onGetVoidedBill.bind(controller));
router.get("/getvoidedbills", controller.onGetVoidedBills.bind(controller));
router.patch("/updatevoidedbill/:id", controller.onUpdateVoidedBill.bind(controller));
// Export the configured router
exports.default = router;
