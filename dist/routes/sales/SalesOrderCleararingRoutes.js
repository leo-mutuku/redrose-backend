"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const SalesOrderClearingRepository_1 = require("../../repositories/sales/SalesOrderClearingRepository");
const SalesOrderClearingController_1 = require("../../controllers/sales/SalesOrderClearingController");
const SalesOrderCleringInteractor_1 = require("../../interactors/sales/SalesOrderCleringInteractor");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind SalesOrderClearing-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.SalesOrderClearingRepository).to(SalesOrderClearingRepository_1.SalesOrderClearingRepository);
container.bind(utils_1.INTERFACE_TYPE.SalesOrderClearingInteractor).to(SalesOrderCleringInteractor_1.SalesOrderClearingInteractor);
container.bind(utils_1.INTERFACE_TYPE.SalesOrderClearingController).to(SalesOrderClearingController_1.SalesOrderClearingController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.SalesOrderClearingController);
// Define the routes and bind controller methods
router.post("/createsalesorderclearing", controller.onCreateSalesOrderClearing.bind(controller));
router.get("/getsalesorderclearing/:id", controller.onGetSalesOrderClearing.bind(controller));
router.get("/getsalesorderclearings", controller.onGetSalesOrderClearings.bind(controller));
router.patch("/updatesalesorderclearing/:id", controller.onUpdateSalesOrderClearing.bind(controller));
// Export the configured router
exports.default = router;
