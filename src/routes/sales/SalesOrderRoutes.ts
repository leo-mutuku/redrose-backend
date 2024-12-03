import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { SalesOrderRepository } from "../../repositories/sales/SalesOrderRepository";
import { SalesOrderInteractor } from "../../interactors/sales/SalesOrderInteractor";
import { SalesOrderController } from "../../controllers/sales/SalesOrderController";
import { ISalesOrderRepository } from "../../interfaces/sales/ISalesOrderRepository";
import { ISalesOrderInteractor } from "../../interfaces/sales/ISalesOrderInteractor";

// Initialize Inversify container
const container = new Container();

// Bind SalesOrder-related interfaces to their implementations
container.bind<ISalesOrderRepository>(INTERFACE_TYPE.SalesOrderRepository).to(SalesOrderRepository);
container.bind<ISalesOrderInteractor>(INTERFACE_TYPE.SalesOrderInteractor).to(SalesOrderInteractor);
container.bind(INTERFACE_TYPE.SalesOrderController).to(SalesOrderController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<SalesOrderController>(INTERFACE_TYPE.SalesOrderController);

// Define the routes and bind controller methods
router.post("/createsalesorder", controller.onCreateSalesOrder.bind(controller));
router.get("/getsalesorder/:id", controller.onGetSalesOrder.bind(controller));
router.get("/getsalesorders", controller.onGetSalesOrders.bind(controller));
router.patch("/updatesalesorder/:id", controller.onUpdateSalesOrder.bind(controller));

// Export the configured router
export default router;
