import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PurchaseRequisitionRepository } from "../../repositories/purchase/PurchaseRequisitionRepository";
import { PurchaseRequisitionInteractor } from "../../interactors/purchase/PurchaseRequisitionInteractor";
import { PurchaseRequisitionController } from "../../controllers/purchase/PurchaseRequisitionController";
import { IPurchaseRequisitionRepository } from "../../interfaces/purchase/IPurchaseRequisitionRepository";
import { IPurchaseRequisitionInteractor } from "../../interfaces/purchase/IPurchaseRequisitionInteractor";

// Initialize Inversify container
const container = new Container();

// Bind PurchaseRequisition-related interfaces to their implementations
container.bind<IPurchaseRequisitionRepository>(INTERFACE_TYPE.PurchaseRequisitionRepository).to(PurchaseRequisitionRepository);
container.bind<IPurchaseRequisitionInteractor>(INTERFACE_TYPE.PurchaseRequisitionInteractor).to(PurchaseRequisitionInteractor);
container.bind(INTERFACE_TYPE.PurchaseRequisitionController).to(PurchaseRequisitionController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PurchaseRequisitionController>(INTERFACE_TYPE.PurchaseRequisitionController);

// Define the routes and bind controller methods
router.post("/createpurchaserequisition", controller.onCreatePurchaseRequisition.bind(controller));
router.get("/getpurchaserequisition/:id", controller.onGetPurchaseRequisition.bind(controller));
router.get("/getpurchaserequisitions", controller.onGetPurchaseRequisitions.bind(controller));
router.patch("/updatepurchaserequisition/:id", controller.onUpdatePurchaseRequisition.bind(controller));

// Export the configured router
export default router;
