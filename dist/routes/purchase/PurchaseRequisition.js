"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PurchaseRequisitionRepository_1 = require("../../repositories/purchase/PurchaseRequisitionRepository");
const PurchaseRequisitionInteractor_1 = require("../../interactors/purchase/PurchaseRequisitionInteractor");
const PurchaseRequisitionController_1 = require("../../controllers/purchase/PurchaseRequisitionController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PurchaseRequisition-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PurchaseRequisitionRepository).to(PurchaseRequisitionRepository_1.PurchaseRequisitionRepository);
container.bind(utils_1.INTERFACE_TYPE.PurchaseRequisitionInteractor).to(PurchaseRequisitionInteractor_1.PurchaseRequisitionInteractor);
container.bind(utils_1.INTERFACE_TYPE.PurchaseRequisitionController).to(PurchaseRequisitionController_1.PurchaseRequisitionController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PurchaseRequisitionController);
// Define the routes and bind controller methods
router.post("/createpurchaserequisition", controller.onCreatePurchaseRequisition.bind(controller));
router.get("/getpurchaserequisition/:id", controller.onGetPurchaseRequisition.bind(controller));
router.get("/getpurchaserequisitions", controller.onGetPurchaseRequisitions.bind(controller));
router.patch("/updatepurchaserequisition/:id", controller.onUpdatePurchaseRequisition.bind(controller));
// Export the configured router
exports.default = router;
