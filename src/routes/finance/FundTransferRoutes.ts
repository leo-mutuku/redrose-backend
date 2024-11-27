import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IFundTransferRepository } from "../../interfaces/finance/IFundTransferRepository";
import { IFundTransferInteractor } from "../../interfaces/finance/IFundTransferInteractor";
import { FundTransferInteractor } from "../../interactors/finance/FundTransferInteractor";
import { FundTransferController } from "../../controllers/finance/FundTransferController";
import { FundTransferRepository } from "../../repositories/finance/FundTransferRepository";

// Create the Inversify container
const container = new Container();

// Bind interfaces to their implementations
container.bind<IFundTransferRepository>(INTERFACE_TYPE.FundTransferRepository).to(FundTransferRepository);
container.bind<IFundTransferInteractor>(INTERFACE_TYPE.FundTransferInteractor).to(FundTransferInteractor);
container.bind(INTERFACE_TYPE.FundTransferController).to(FundTransferController);

// Initialize the router
const router = Router();
const controller = container.get<FundTransferController>(INTERFACE_TYPE.FundTransferController);

// Define routes for fund transfer operations
router.post("/create", controller.onCreateFundTransfer.bind(controller));
router.get("/gettransfer/:id", controller.onGetFundTransfer.bind(controller));
router.get("/gettransfers", controller.onGetFundTransfers.bind(controller));
router.patch("/updatetransfer/:id", controller.onUpdateFundTransfer.bind(controller));
router.delete("/deletetransfer/:id", controller.onDeleteFundTransfer.bind(controller));

export default router;
