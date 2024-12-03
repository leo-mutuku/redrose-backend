"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const ItemCategoryRepository_1 = require("../../repositories/store/ItemCategoryRepository");
const ItemCategoryInteractor_1 = require("../../interactors/store/ItemCategoryInteractor");
const ItemCategoryController_1 = require("../../controllers/store/ItemCategoryController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind ItemCategory-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.ItemCategoryRepository).to(ItemCategoryRepository_1.ItemCategoryRepository);
container.bind(utils_1.INTERFACE_TYPE.ItemCategoryInteractor).to(ItemCategoryInteractor_1.ItemCategoryInteractor);
container.bind(utils_1.INTERFACE_TYPE.ItemCategoryController).to(ItemCategoryController_1.ItemCategoryController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.ItemCategoryController);
// Define the routes and bind controller methods
router.post("/createitemcategory", controller.onCreateItemCategory.bind(controller));
router.get("/getitemcategory/:id", controller.onGetItemCategory.bind(controller));
router.get("/getitemcategories", controller.onGetItemCategories.bind(controller));
router.patch("/updateitemcategory/:id", controller.onUpdateItemCategory.bind(controller));
// Export the configured router
exports.default = router;
