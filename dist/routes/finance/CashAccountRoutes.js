"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const CashAccountInteractor_1 = require("../../interactors/finance/CashAccountInteractor");
const CashAccountController_1 = require("../../controllers/finance/CashAccountController");
const CashAccountRepository_1 = require("../../repositories/finance/CashAccountRepository");
// Create the Inversify container
const container = new inversify_1.Container();
// Bind interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.CashAccountRepository).to(CashAccountRepository_1.CashAccountRepository);
container.bind(utils_1.INTERFACE_TYPE.CashAccountInteractor).to(CashAccountInteractor_1.CashAccountInteractor);
container.bind(utils_1.INTERFACE_TYPE.CashAccountController).to(CashAccountController_1.CashAccountController);
// Initialize the router
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.CashAccountController);
// Define routes for cash account operations
router.post("/createcashaccounts", controller.onCreateCashAccount.bind(controller));
router.get("/getcashaccount/:id", controller.onGetCashAccount.bind(controller));
router.get("/getcashaccounts", controller.onGetCashAccounts.bind(controller));
router.patch("/updatecashaccount/:id", controller.onUpdateCashAccount.bind(controller));
router.delete("/deletecashaccount/:id", controller.onDeleteCashAccount.bind(controller));
exports.default = router;
