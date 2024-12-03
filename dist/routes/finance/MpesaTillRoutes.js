"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const MpesaTillInteractor_1 = require("../../interactors/finance/MpesaTillInteractor");
const MpesaTillController_1 = require("../../controllers/finance/MpesaTillController");
const MpesaTillRepository_1 = require("../../repositories/finance/MpesaTillRepository");
// Create the Inversify container
const container = new inversify_1.Container();
// Bind interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.MpesaTillRepository).to(MpesaTillRepository_1.MpesaTillRepository);
container.bind(utils_1.INTERFACE_TYPE.MpesaTillInteractor).to(MpesaTillInteractor_1.MpesaTillInteractor);
container.bind(utils_1.INTERFACE_TYPE.MpesaTillController).to(MpesaTillController_1.MpesaTillController);
// Initialize the router
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.MpesaTillController);
// Define routes for Mpesa Till operations
router.post("/creatempesatill", controller.onCreateMpesaTill.bind(controller));
router.get("/gettill/:id", controller.onGetMpesaTill.bind(controller));
router.get("/gettills", controller.onGetMpesaTills.bind(controller));
router.patch("/updatetill/:id", controller.onUpdateMpesaTill.bind(controller));
router.delete("/deletetill/:id", controller.onDeleteMpesaTill.bind(controller));
exports.default = router;
