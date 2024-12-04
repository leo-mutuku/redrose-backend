"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const MenuRegisterRepository_1 = require("../../repositories/kitchen/MenuRegisterRepository");
const MenuRegisterInteractor_1 = require("../../interactors/kitchen/MenuRegisterInteractor");
const MenuRegisterController_1 = require("../../controllers/kitchen/MenuRegisterController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind Menu Register-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.MenuRegisterRepository).to(MenuRegisterRepository_1.MenuRegisterRepository);
container.bind(utils_1.INTERFACE_TYPE.MenuRegisterInteractor).to(MenuRegisterInteractor_1.MenuRegisterInteractor);
container.bind(utils_1.INTERFACE_TYPE.MenuRegisterController).to(MenuRegisterController_1.MenuRegisterController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.MenuRegisterController);
// Define the routes and bind controller methods
router.post("/createmenu", controller.onCreateMenuRegister.bind(controller));
router.get("/getmenu/:id", controller.onGetMenuRegister.bind(controller));
router.get("/getmenus", controller.onGetMenuRegisters.bind(controller));
router.patch("/updatemenu/:id", controller.onUpdateMenuRegister.bind(controller));
// Export the configured router
exports.default = router;
