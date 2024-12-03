"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const BankInteractor_1 = require("../../interactors/finance/BankInteractor");
const BankController_1 = require("../../controllers/finance/BankController");
const BankRepository_1 = require("../../repositories/finance/BankRepository");
// Create the Inversify container
const container = new inversify_1.Container();
// Bind interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.BankRepository).to(BankRepository_1.BankRepository);
container.bind(utils_1.INTERFACE_TYPE.BankInteractor).to(BankInteractor_1.BankInteractor);
container.bind(utils_1.INTERFACE_TYPE.BankController).to(BankController_1.BankController);
// Initialize the router
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.BankController);
// Define routes for bank operations
router.post("/createbank", controller.onCreateBank.bind(controller));
router.get("/getbank/:id", controller.onGetBank.bind(controller));
router.get("/getbanks", controller.onGetBanks.bind(controller));
router.patch("/updatebank/:id", controller.onUpdateBank.bind(controller));
router.delete("/deletebank/:id", controller.onDeleteBank.bind(controller));
exports.default = router;
