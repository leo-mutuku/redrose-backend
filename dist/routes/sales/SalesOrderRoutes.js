"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const SalesOrderRepository_1 = require("../../repositories/sales/SalesOrderRepository");
const SalesOrderInteractor_1 = require("../../interactors/sales/SalesOrderInteractor");
const SalesOrderController_1 = require("../../controllers/sales/SalesOrderController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind SalesOrder-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.SalesOrderRepository).to(SalesOrderRepository_1.SalesOrderRepository);
container.bind(utils_1.INTERFACE_TYPE.SalesOrderInteractor).to(SalesOrderInteractor_1.SalesOrderInteractor);
container.bind(utils_1.INTERFACE_TYPE.SalesOrderController).to(SalesOrderController_1.SalesOrderController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.SalesOrderController);
// Define the routes and bind controller methods
router.post("/createsalesorder", controller.onCreateSalesOrder.bind(controller));
router.get("/getsalesorder/:id", controller.onGetSalesOrder.bind(controller));
router.get("/getsalesorders", controller.onGetSalesOrders.bind(controller));
router.patch("/updatesalesorder/:id", controller.onUpdateSalesOrder.bind(controller));
// Export the configured router
exports.default = router;
