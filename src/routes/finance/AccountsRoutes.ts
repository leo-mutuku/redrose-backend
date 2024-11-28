import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IAccountRepository } from "../../interfaces/finance/IAccountRepository";

import { IAccountInteractor } from "../../interfaces/finance/IAccountInteractor";
import { AccountInteractor } from "../../interactors/finance/AccountInteractor";
import { AccountController } from "../../controllers/finance/AccountsController";
import { AccountRepository } from "../../repositories/finance/AccountRepository";


const container = new Container();

container.bind<IAccountRepository>(INTERFACE_TYPE.AccountRepository).to(AccountRepository);
container.bind<IAccountInteractor>(INTERFACE_TYPE.AccountInteractor).to(AccountInteractor);
container.bind(INTERFACE_TYPE.AccountController).to(AccountController);

const router = Router();
const controller = container.get<AccountController>(INTERFACE_TYPE.AccountController);

router.post("/createaccount", controller.onCreateAccount.bind(controller));
router.get("/getaccount/:id", controller.onGetAccount.bind(controller));
router.get("/getaccounts", controller.onGetAccounts.bind(controller));
router.patch("/updateaccount/:id", controller.onUpdateAccount.bind(controller));
router.delete("/deleteaccount/:id", controller.onDeleteAccount.bind(controller));

export default router;
