"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const MenuCategoryRepository_1 = require("../../repositories/kitchen/MenuCategoryRepository");
const MenuCategoryInteractor_1 = require("../../interactors/kitchen/MenuCategoryInteractor");
const MenuCategoryController_1 = require("../../controllers/kitchen/MenuCategoryController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind MenuCategory-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.MenuCategoryRepository).to(MenuCategoryRepository_1.MenuCategoryRepository);
container.bind(utils_1.INTERFACE_TYPE.MenuCategoryInteractor).to(MenuCategoryInteractor_1.MenuCategoryInteractor);
container.bind(utils_1.INTERFACE_TYPE.MenuCategoryController).to(MenuCategoryController_1.MenuCategoryController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.MenuCategoryController);
// Define the routes and bind controller methods
router.post("/createmenucategory", controller.onCreateMenuCategory.bind(controller));
router.get("/getmenucategory/:id", controller.onGetMenuCategory.bind(controller));
router.get("/getmenucategories", controller.onGetMenuCategories.bind(controller));
router.patch("/updatemenucategory/:id", controller.onUpdateMenuCategory.bind(controller));
// Export the configured router
exports.default = router;
