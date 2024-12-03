import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PurchaseOrderRepository } from "../../repositories/purchase/PurchaseOrderRepository";
import { PurchaseOrderInteractor } from "../../interactors/purchase/PurchaseOrderInteractor";
import { PurchaseOrderController } from "../../controllers/purchase/PurchaseOrderController";
import { IPurchaseOrderRepository } from "../../interfaces/purchase/IPurchaseOrderRepository";
import { IPurchaseOrderInteractor } from "../../interfaces/purchase/IPurchaseOrderInteractor";

// Initialize Inversify container
const container = new Container();

// Bind PurchaseOrder-related interfaces to their implementations
container.bind<IPurchaseOrderRepository>(INTERFACE_TYPE.PurchaseOrderRepository).to(PurchaseOrderRepository);
container.bind<IPurchaseOrderInteractor>(INTERFACE_TYPE.PurchaseOrderInteractor).to(PurchaseOrderInteractor);
container.bind(INTERFACE_TYPE.PurchaseOrderController).to(PurchaseOrderController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PurchaseOrderController>(INTERFACE_TYPE.PurchaseOrderController);

// Define the routes and bind controller methods
router.post("/createpurchaseorder", controller.onCreatePurchaseOrder.bind(controller));
router.get("/getpurchaseorder/:id", controller.onGetPurchaseOrder.bind(controller));
router.get("/getpurchaseorders", controller.onGetPurchaseOrders.bind(controller));
router.patch("/updatepurchaseorder/:id", controller.onUpdatePurchaseOrder.bind(controller));

// Export the configured router
export default router;
