"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const CancelledOrderController_1 = require("../../controllers/sales/CancelledOrderController");
const CancelOrderRepository_1 = require("../../repositories/sales/CancelOrderRepository");
const CancelledOrderInteractor_1 = require("../../interactors/sales/CancelledOrderInteractor");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind CancelledOrder-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.CancelledOrderRepository).to(CancelOrderRepository_1.CancelOrderRepository);
container.bind(utils_1.INTERFACE_TYPE.CancelledOrderInteractor).to(CancelledOrderInteractor_1.CancelledOrderInteractor);
container.bind(utils_1.INTERFACE_TYPE.CancelledOrderController).to(CancelledOrderController_1.CancelledOrderController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.CancelledOrderController);
// Define the routes and bind controller methods
router.post("/createcancelledorder", controller.onCreateCancelledOrder.bind(controller));
router.get("/getcancelledorder/:id", controller.onGetCancelledOrder.bind(controller));
router.get("/getcancelledorders", controller.onGetCancelledOrders.bind(controller));
router.patch("/updatecancelledorder/:id", controller.onUpdateCancelledOrder.bind(controller));
// Export the configured router
exports.default = router;
