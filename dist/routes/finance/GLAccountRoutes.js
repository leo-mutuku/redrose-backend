"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const GLAccountInteractor_1 = require("../../interactors/finance/GLAccountInteractor");
const GLAccountController_1 = require("../../controllers/finance/GLAccountController");
const GLAccountRepository_1 = require("../../repositories/finance/GLAccountRepository");
;
// Create the Inversify container
const container = new inversify_1.Container();
// Bind interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.GLAccountRepository).to(GLAccountRepository_1.GLAccountRepository);
container.bind(utils_1.INTERFACE_TYPE.GLAccountInteractor).to(GLAccountInteractor_1.GLAccountInteractor);
container.bind(utils_1.INTERFACE_TYPE.GLAccountController).to(GLAccountController_1.GLAccountController);
// Initialize the router
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.GLAccountController);
// Define routes for General Ledger (GL) accounts
router.post("/createglaccount", controller.onCreateGLAccount.bind(controller));
router.get("/getglaccount/:id", controller.onGetGLAccount.bind(controller));
router.get("/getglaccounts", controller.onGetGLAccounts.bind(controller));
router.patch("/updateglaccount/:id", controller.onUpdateGLAccount.bind(controller));
router.delete("/deleteaccount/:id", controller.onDeleteGLAccount.bind(controller));
exports.default = router;
