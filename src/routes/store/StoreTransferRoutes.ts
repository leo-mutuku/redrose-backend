import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { StoreTransferRepository } from "../../repositories/store/StoreTransferRepository";
import { StoreTransferInteractor } from "../../interactors/store/StoreTransferInteractor";
import { StoreTransferController } from "../../controllers/store/StoreTransferController";
import { IStoreTransferRepository } from "../../interfaces/store/IStoreTransferRepository";
import { IStoreTransferInteractor } from "../../interfaces/store/IStoreTransferInteractor";

// Initialize Inversify container
const container = new Container();

// Bind StoreTransfer-related interfaces to their implementations
container.bind<IStoreTransferRepository>(INTERFACE_TYPE.StoreTransferRepository).to(StoreTransferRepository);
container.bind<IStoreTransferInteractor>(INTERFACE_TYPE.StoreTransferInteractor).to(StoreTransferInteractor);
container.bind(INTERFACE_TYPE.StoreTransferController).to(StoreTransferController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<StoreTransferController>(INTERFACE_TYPE.StoreTransferController);

// Define the routes and bind controller methods
router.post("/createstoretransfer", controller.onCreateStoreTransfer.bind(controller));
router.get("/getstoretransfer/:id", controller.onGetStoreTransfer.bind(controller));
router.get("/getstoretransfers", controller.onGetStoreTransfers.bind(controller));
router.patch("/updatestoretransfer/:id", controller.onUpdateStoreTransfer.bind(controller));

// Export the configured router
export default router;
