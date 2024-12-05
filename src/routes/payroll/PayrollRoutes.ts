import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";

import { PayrollController } from "../../controllers/payroll/PayrollController";
import { PayrollInteractor } from "../../interactors/payroll/PayrollInteractor";
import { IPayrollInteractor } from "../../interfaces/payroll/IPayrollInteractor";
import { IPayrollRepository } from "../../interfaces/payroll/IPayrollRepository";
import { PayrollRepository } from "../../repositories/payroll/PayrollRepository";

// Initialize Inversify container
const container = new Container();

// Bind PayrollCategory-related interfaces to their implementations
container.bind<IPayrollRepository>(INTERFACE_TYPE.PayrollRepository).to(PayrollRepository);
container.bind<IPayrollInteractor>(INTERFACE_TYPE.PayrollInteractor).to(PayrollInteractor);
container.bind(INTERFACE_TYPE.PayrollController).to(PayrollController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PayrollController>(INTERFACE_TYPE.PayrollController);

// Define the routes and bind controller methods
router.post("/createpayroll", controller.onCreatePayroll.bind(controller));
router.get("/getpayroll:id", controller.onGetPayroll.bind(controller));
router.get("/getpayrolls", controller.onGetAllPayrolls.bind(controller));
router.patch("/updatepayroll/:id", controller.onUpdatePayroll.bind(controller));

// Export the configured router
export default router;
