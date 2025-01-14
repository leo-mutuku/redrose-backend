import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { SalesOrderRepository } from "../../repositories/sales/SalesOrderRepository";
import { SalesOrderInteractor } from "../../interactors/sales/SalesOrderInteractor";
import { SalesOrderController } from "../../controllers/sales/SalesOrderController";
import { ISalesOrderRepository } from "../../interfaces/sales/ISalesOrderRepository";
import { ISalesOrderInteractor } from "../../interfaces/sales/ISalesOrderInteractor";
import { POSTerminalPrintBillController } from "../../controllers/sales/POSTerminalPrintBillControler";
import { POSTerminalPrintBillRepository } from "../../repositories/sales/POSTerminalBillRepository";
import { POSTerminalPrintBillInteractor } from "../../interactors/sales/POSTerminalBillInteractor";
import { IPOSTerminalPrintBillInteractor } from "../../interfaces/sales/IPOSTerminalPrintBillInteractor";
import { IPOSTerminalPrintBillRepository } from "../../interfaces/sales/IPOSTerminalPrintBillRepository";


// Initialize Inversify container
const container = new Container();

// Bind SalesOrder-related interfaces to their implementations

container.bind(INTERFACE_TYPE.POSTerminalPrintBillController).to(POSTerminalPrintBillController);
container.bind<IPOSTerminalPrintBillInteractor>(INTERFACE_TYPE.POSTerminalPrintBillInteractor).to(POSTerminalPrintBillInteractor);
container.bind<IPOSTerminalPrintBillRepository>(INTERFACE_TYPE.POSTerminalPrintBillRepository).to(POSTerminalPrintBillRepository);

// Create the router instance
const router = Router();

// Get the controller instance

const controller = container.get<POSTerminalPrintBillController>(INTERFACE_TYPE.POSTerminalPrintBillController);

// Define the routes and bind controller methods

router.post("/validatewaiter", controller.onValidateWaiter.bind(controller));


// Export the configured router
export default router;
