"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PayrollCategoryRepository_1 = require("../../repositories/payroll/PayrollCategoryRepository");
const PayrollCategoryInteractor_1 = require("../../interactors/payroll/PayrollCategoryInteractor");
const PayrollCategoryController_1 = require("../../controllers/payroll/PayrollCategoryController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PayrollCategory-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PayrollCategoryRepository).to(PayrollCategoryRepository_1.PayrollCategoryRepository);
container.bind(utils_1.INTERFACE_TYPE.PayrollCategoryInteractor).to(PayrollCategoryInteractor_1.PayrollCategoryInteractor);
container.bind(utils_1.INTERFACE_TYPE.PayrollCategoryController).to(PayrollCategoryController_1.PayrollCategoryController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PayrollCategoryController);
// Define the routes and bind controller methods
router.post("/create", controller.onCreatePayrollCategory.bind(controller));
router.get("/:id", controller.onGetPayrollCategory.bind(controller));
router.get("/", controller.onGetPayrollCategories.bind(controller));
router.patch("/:id", controller.onUpdatePayrollCategory.bind(controller));
// Export the configured router
exports.default = router;
