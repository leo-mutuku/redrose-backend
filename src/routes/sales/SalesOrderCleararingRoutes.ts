import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { SalesOrderClearingRepository } from "../../repositories/sales/SalesOrderClearingRepository";
import { SalesOrderClearingInteractor } from "../../interactors/sales/SalesOrderClearingInteractor";
import { SalesOrderClearingController } from "../../controllers/sales/SalesOrderClearingController";
import { ISalesOrderClearingRepository } from "../../interfaces/sales/ISalesOrderClearingRepository";
import { ISalesOrderClearingInteractor } from "../../interfaces/sales/ISalesOrderClearingInteractor";

// Initialize Inversify container
const container = new Container();

// Bind SalesOrderClearing-related interfaces to their implementations
container.bind<ISalesOrderClearingRepository>(INTERFACE_TYPE.SalesOrderClearingRepository).to(SalesOrderClearingRepository);
container.bind<ISalesOrderClearingInteractor>(INTERFACE_TYPE.SalesOrderClearingInteractor).to(SalesOrderClearingInteractor);
container.bind(INTERFACE_TYPE.SalesOrderClearingController).to(SalesOrderClearingController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<SalesOrderClearingController>(INTERFACE_TYPE.SalesOrderClearingController);

// Define the routes and bind controller methods
router.post("/createsalesorderclearing", controller.onCreateSalesOrderClearing.bind(controller));
router.get("/getsalesorderclearing/:id", controller.onGetSalesOrderClearing.bind(controller));
router.get("/getsalesorderclearings", controller.onGetSalesOrderClearings.bind(controller));
router.patch("/updatesalesorderclearing/:id", controller.onUpdateSalesOrderClearing.bind(controller));

// Export the configured router
export default router;
