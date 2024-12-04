"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const CashierRegisterRepository_1 = require("../../repositories/sales/CashierRegisterRepository");
const CashierRegisterInteractor_1 = require("../../interactors/sales/CashierRegisterInteractor");
const CashierRegisterController_1 = require("../../controllers/sales/CashierRegisterController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind CashierRegister-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.CashierRegisterRepository).to(CashierRegisterRepository_1.CashierRegisterRepository);
container.bind(utils_1.INTERFACE_TYPE.CashierRegisterInteractor).to(CashierRegisterInteractor_1.CashierRegisterInteractor);
container.bind(utils_1.INTERFACE_TYPE.CashierRegisterController).to(CashierRegisterController_1.CashierRegisterController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.CashierRegisterController);
// Define the routes and bind controller methods
router.post("/createcashierregister", controller.onCreateCashierRegister.bind(controller));
router.get("/getcashierregister/:id", controller.onGetCashierRegister.bind(controller));
router.get("/getcashierregisters", controller.onGetCashierRegisters.bind(controller));
router.patch("/updatecashierregister/:id", controller.onUpdateCashierRegister.bind(controller));
// Export the configured router
exports.default = router;
