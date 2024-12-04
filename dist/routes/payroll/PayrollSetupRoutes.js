"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PayrollSetupRepository_1 = require("../../repositories/payroll/PayrollSetupRepository");
const PayrollSetupInteractor_1 = require("../../interactors/payroll/PayrollSetupInteractor");
const PayrollSetupController_1 = require("../../controllers/payroll/PayrollSetupController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PayrollSetup-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PayrollSetupRepository).to(PayrollSetupRepository_1.PayrollSetupRepository);
container.bind(utils_1.INTERFACE_TYPE.PayrollSetupInteractor).to(PayrollSetupInteractor_1.PayrollSetupInteractor);
container.bind(utils_1.INTERFACE_TYPE.PayrollSetupController).to(PayrollSetupController_1.PayrollSetupController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PayrollSetupController);
// Define the routes and bind controller methods
router.post("/create", controller.onCreatePayrollSetup.bind(controller));
router.get("/:id", controller.onGetPayrollSetup.bind(controller));
router.get("/", controller.onGetPayrollSetups.bind(controller));
router.patch("/:id", controller.onUpdatePayrollSetup.bind(controller));
// Export the configured router
exports.default = router;
