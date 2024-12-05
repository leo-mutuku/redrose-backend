"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PurchaseOrderRepository_1 = require("../../repositories/purchase/PurchaseOrderRepository");
const PurchaseOrderController_1 = require("../../controllers/purchase/PurchaseOrderController");
const PurchaseOrderIneractor_1 = require("../../interactors/purchase/PurchaseOrderIneractor");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PurchaseOrder-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PurchaseOrderRepository).to(PurchaseOrderRepository_1.PurchaseOrderRepository);
container.bind(utils_1.INTERFACE_TYPE.PurchaseOrderInteractor).to(PurchaseOrderIneractor_1.PurchaseOrderInteractor);
container.bind(utils_1.INTERFACE_TYPE.PurchaseOrderController).to(PurchaseOrderController_1.PurchaseOrderController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PurchaseOrderController);
// Define the routes and bind controller methods
router.post("/createpurchaseorder", controller.onCreatePurchaseOrder.bind(controller));
router.get("/getpurchaseorder/:id", controller.onGetPurchaseOrder.bind(controller));
router.get("/getpurchaseorders", controller.onGetPurchaseOrders.bind(controller));
router.patch("/updatepurchaseorder/:id", controller.onUpdatePurchaseOrder.bind(controller));
// Export the configured router
exports.default = router;
