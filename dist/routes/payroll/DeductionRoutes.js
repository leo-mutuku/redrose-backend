"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const DeductionRepository_1 = require("../../repositories/payroll/DeductionRepository");
const DeductionInteractor_1 = require("../../interactors/payroll/DeductionInteractor");
const DeductionController_1 = require("../../controllers/payroll/DeductionController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Deduction-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.DeductionRepository).to(DeductionRepository_1.DeductionRepository);
container.bind(utils_1.INTERFACE_TYPE.DeductionInteractor).to(DeductionInteractor_1.DeductionInteractor);
container.bind(utils_1.INTERFACE_TYPE.DeductionController).to(DeductionController_1.DeductionController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.DeductionController);
// Define the routes and bind controller methods
router.post("/creatededuction", controller.onCreateDeduction.bind(controller));
router.get("/getdeduction/:id", controller.onGetDeduction.bind(controller));
router.get("/getdeductions", controller.onGetDeductions.bind(controller));
router.patch("/updatededuction/:id", controller.onUpdateDeduction.bind(controller));
// Export the configured router
exports.default = router;
