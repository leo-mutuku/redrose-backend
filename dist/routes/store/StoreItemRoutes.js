"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const StoreItemRepository_1 = require("../../repositories/store/StoreItemRepository");
const StoreItemInteractor_1 = require("../../interactors/store/StoreItemInteractor");
const StoreItemController_1 = require("../../controllers/store/StoreItemController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Item-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.StoreItemRepository).to(StoreItemRepository_1.StoreItemRepository);
container.bind(utils_1.INTERFACE_TYPE.StoreItemInteractor).to(StoreItemInteractor_1.StoreItemInteractor);
container.bind(utils_1.INTERFACE_TYPE.StoreItemController).to(StoreItemController_1.StoreItemController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.StoreItemController);
// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateStoreItem.bind(controller));
router.get("/getitem/:id", controller.onGetStoreItem.bind(controller));
router.get("/getitems", controller.onGetStoreItems.bind(controller)); // Example for listing items with pagination
router.patch("/updateitem/:id", controller.onUpdateStoreItem.bind(controller));
// Export the configured router
exports.default = router;
