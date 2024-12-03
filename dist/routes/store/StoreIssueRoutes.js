"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const StoreIssueInteractor_1 = require("../../interactors/store/StoreIssueInteractor");
const StoreIssueController_1 = require("../../controllers/store/StoreIssueController");
const StoreIssueRepository_1 = require("../../repositories/store/StoreIssueRepository");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Issue-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.StoreIssueRepository).to(StoreIssueRepository_1.StoreIssueRepository);
container.bind(utils_1.INTERFACE_TYPE.StoreIssueInteractor).to(StoreIssueInteractor_1.StoreIssueInteractor);
container.bind(utils_1.INTERFACE_TYPE.StoreIssueController).to(StoreIssueController_1.StoreIssueController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.StoreIssueController);
// Define the routes and bind controller methods
router.post("/createissue", controller.onCreateStoreIssue.bind(controller));
router.get("/getissue/:id", controller.onGetStoreIssue.bind(controller));
router.get("/getissues", controller.onGetStoreIssues.bind(controller)); // Example for listing issues with pagination
router.patch("/updateissue/:id", controller.onUpdateStoreIssue.bind(controller));
// Export the configured router
exports.default = router;
