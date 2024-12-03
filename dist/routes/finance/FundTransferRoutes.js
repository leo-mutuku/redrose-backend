"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const FundTransferInteractor_1 = require("../../interactors/finance/FundTransferInteractor");
const FundTransferController_1 = require("../../controllers/finance/FundTransferController");
const FundTransferRepository_1 = require("../../repositories/finance/FundTransferRepository");
// Create the Inversify container
const container = new inversify_1.Container();
// Bind interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.FundTransferRepository).to(FundTransferRepository_1.FundTransferRepository);
container.bind(utils_1.INTERFACE_TYPE.FundTransferInteractor).to(FundTransferInteractor_1.FundTransferInteractor);
container.bind(utils_1.INTERFACE_TYPE.FundTransferController).to(FundTransferController_1.FundTransferController);
// Initialize the router
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.FundTransferController);
// Define routes for fund transfer operations
router.post("/create", controller.onInitiateFundTransfer.bind(controller));
router.get("/gettransfer/:id", controller.onGetFundTransfer.bind(controller));
router.get("/gettransfers", controller.onGetAllFundTransfers.bind(controller));
router.patch("/updatetransfer/:id", controller.onUpdateFundTransfer.bind(controller));
router.delete("/deletetransfer/:id", controller.onDeleteFundTransfer.bind(controller));
exports.default = router;
