"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PayrollController_1 = require("../../controllers/payroll/PayrollController");
const PayrollInteractor_1 = require("../../interactors/payroll/PayrollInteractor");
const PayrollRepository_1 = require("../../repositories/payroll/PayrollRepository");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PayrollCategory-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PayrollRepository).to(PayrollRepository_1.PayrollRepository);
container.bind(utils_1.INTERFACE_TYPE.PayrollInteractor).to(PayrollInteractor_1.PayrollInteractor);
container.bind(utils_1.INTERFACE_TYPE.PayrollController).to(PayrollController_1.PayrollController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PayrollController);
// Define the routes and bind controller methods
router.post("/createpayroll", controller.onCreatePayroll.bind(controller));
router.get("/getpayroll:id", controller.onGetPayroll.bind(controller));
router.get("/getpayrolls", controller.onGetAllPayrolls.bind(controller));
router.patch("/updatepayroll/:id", controller.onUpdatePayroll.bind(controller));
// Export the configured router
exports.default = router;
