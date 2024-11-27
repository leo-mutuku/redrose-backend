import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IGLAccountRepository } from "../../interfaces/finance/IGLAccountRepository";
import { IGLAccountInteractor } from "../../interfaces/finance/IGLAccountInteractor";
import { GLAccountInteractor } from "../../interactors/finance/GLAccountInteractor";
import { GLAccountController } from "../../controllers/finance/GLAccountController";
import { GLAccountRepository } from "../../repositories/finance/GLAccountRepository";

// Create the Inversify container
const container = new Container();

// Bind interfaces to their implementations
container.bind<IGLAccountRepository>(INTERFACE_TYPE.GLAccountRepository).to(GLAccountRepository);
container.bind<IGLAccountInteractor>(INTERFACE_TYPE.GLAccountInteractor).to(GLAccountInteractor);
container.bind(INTERFACE_TYPE.GLAccountController).to(GLAccountController);

// Initialize the router
const router = Router();
const controller = container.get<GLAccountController>(INTERFACE_TYPE.GLAccountController);

// Define routes for General Ledger (GL) accounts
router.post("/create", controller.onCreateGLAccount.bind(controller));
router.get("/getaccount/:id", controller.onGetGLAccount.bind(controller));
router.get("/getaccounts", controller.onGetGLAccounts.bind(controller));
router.patch("/updateaccount/:id", controller.onUpdateGLAccount.bind(controller));
router.delete("/deleteaccount/:id", controller.onDeleteGLAccount.bind(controller));

export default router;
