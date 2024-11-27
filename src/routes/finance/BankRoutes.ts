import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IBankRepository } from "../../interfaces/finance/IBankRepository";
import { IBankInteractor } from "../../interfaces/finance/IBankInteractor";
import { BankInteractor } from "../../interactors/finance/BankInteractor";
import { BankController } from "../../controllers/finance/BankController";
import { BankRepository } from "../../repositories/finance/BankRepository";

// Create the Inversify container
const container = new Container();

// Bind interfaces to their implementations
container.bind<IBankRepository>(INTERFACE_TYPE.BankRepository).to(BankRepository);
container.bind<IBankInteractor>(INTERFACE_TYPE.BankInteractor).to(BankInteractor);
container.bind(INTERFACE_TYPE.BankController).to(BankController);

// Initialize the router
const router = Router();
const controller = container.get<BankController>(INTERFACE_TYPE.BankController);

// Define routes for bank operations
router.post("/create", controller.onCreateBank.bind(controller));
router.get("/getbank/:id", controller.onGetBank.bind(controller));
router.get("/getbanks", controller.onGetBanks.bind(controller));
router.patch("/updatebank/:id", controller.onUpdateBank.bind(controller));
router.delete("/deletebank/:id", controller.onDeleteBank.bind(controller));

export default router;
