"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const MenuItemRepository_1 = require("../../repositories/kitchen/MenuItemRepository");
const MenuItemInteractors_1 = require("../../interactors/kitchen/MenuItemInteractors");
const MenuItemController_1 = require("../../controllers/kitchen/MenuItemController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Menu Item-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.MenuItemRepository).to(MenuItemRepository_1.MenuItemRepository);
container.bind(utils_1.INTERFACE_TYPE.MenuItemInteractor).to(MenuItemInteractors_1.MenuItemInteractor);
container.bind(utils_1.INTERFACE_TYPE.MenuItemController).to(MenuItemController_1.MenuItemController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.MenuItemController);
// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateMenu.bind(controller));
router.get("/getitem/:id", controller.onGetMenuItem.bind(controller));
router.get("/getitems", controller.onGetMenuItemRegisters.bind(controller));
router.patch("/updateitem/:id", controller.onUpdateMenuItem.bind(controller));
// Export the configured router
exports.default = router;
