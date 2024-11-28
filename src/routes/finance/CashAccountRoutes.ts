import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ICashAccountRepository } from "../../interfaces/finance/ICashAccountRepository";
import { ICashAccountInteractor } from "../../interfaces/finance/ICashAccountInteractor";
import { CashAccountInteractor } from "../../interactors/finance/CashAccountInteractor";
import { CashAccountController } from "../../controllers/finance/CashAccountController";
import { CashAccountRepository } from "../../repositories/finance/CashAccountRepository";

// Create the Inversify container
const container = new Container();

// Bind interfaces to their implementations
container.bind<ICashAccountRepository>(INTERFACE_TYPE.CashAccountRepository).to(CashAccountRepository);
container.bind<ICashAccountInteractor>(INTERFACE_TYPE.CashAccountInteractor).to(CashAccountInteractor);
container.bind(INTERFACE_TYPE.CashAccountController).to(CashAccountController);

// Initialize the router
const router = Router();
const controller = container.get<CashAccountController>(INTERFACE_TYPE.CashAccountController);

// Define routes for cash account operations
router.post("/createcashaccounts", controller.onCreateCashAccount.bind(controller));
router.get("/getcashaccount/:id", controller.onGetCashAccount.bind(controller));
router.get("/getcashaccounts", controller.onGetCashAccounts.bind(controller));
router.patch("/updatecashaccount/:id", controller.onUpdateCashAccount.bind(controller));
router.delete("/deletecashaccount/:id", controller.onDeleteCashAccount.bind(controller));

export default router;
