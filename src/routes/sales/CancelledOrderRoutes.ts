import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { CancelledOrderController } from "../../controllers/sales/CancelledOrderController";
import { ICancelledOrderRepository } from "../../interfaces/sales/ICancelledOrderRepository";
import { ICancelledOrderInteractor } from "../../interfaces/sales/ICancelledOrderInteractor";
import { CancelOrderRepository } from "../../repositories/sales/CancelOrderRepository";
import { CancelledOrderInteractor } from "../../interactors/sales/CancelledOrderInteractor";


// Initialize Inversify container
const container = new Container();

// Bind CancelledOrder-related interfaces to their implementations
container.bind<ICancelledOrderRepository>(INTERFACE_TYPE.CancelledOrderRepository).to(CancelOrderRepository);
container.bind<ICancelledOrderInteractor>(INTERFACE_TYPE.CancelledOrderInteractor).to(CancelledOrderInteractor);
container.bind(INTERFACE_TYPE.CancelledOrderController).to(CancelledOrderController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<CancelledOrderController>(INTERFACE_TYPE.CancelledOrderController);

// Define the routes and bind controller methods
router.post("/createcancelledorder", controller.onCreateCancelledOrder.bind(controller));
router.get("/getcancelledorder/:id", controller.onGetCancelledOrder.bind(controller));
router.get("/getcancelledorders", controller.onGetCancelledOrders.bind(controller));
router.patch("/updatecancelledorder/:id", controller.onUpdateCancelledOrder.bind(controller));

// Export the configured router
export default router;
