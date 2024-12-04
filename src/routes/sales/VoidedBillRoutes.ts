import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";

import { VoidedBillInteractor } from "../../interactors/sales/VoidedBillInteractor";
import { VoidedBillController } from "../../controllers/sales/VoidedBillController";
import { IVoidedBillRepository } from "../../interfaces/sales/IvoidedBillRepository";
import { IVoidedBillInteractor } from "../../interfaces/sales/IVoidedBillInteractor";
import { VoidedBillRepository } from "../../repositories/sales/VoidedBillRepositories";


// Initialize Inversify container
const container = new Container();

// Bind VoidedBill-related interfaces to their implementations
container.bind<IVoidedBillRepository>(INTERFACE_TYPE.VoidedBillRepository).to(VoidedBillRepository);
container.bind<IVoidedBillInteractor>(INTERFACE_TYPE.VoidedBillInteractor).to(VoidedBillInteractor);
container.bind(INTERFACE_TYPE.VoidedBillController).to(VoidedBillController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<VoidedBillController>(INTERFACE_TYPE.VoidedBillController);

// Define the routes and bind controller methods
router.post("/createvoidedbill", controller.onCreateVoidedBill.bind(controller));
router.get("/getvoidedbill/:id", controller.onGetVoidedBill.bind(controller));
router.get("/getvoidedbills", controller.onGetVoidedBills.bind(controller));
router.patch("/updatevoidedbill/:id", controller.onUpdateVoidedBill.bind(controller));

// Export the configured router
export default router;
