import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PayrollSetupRepository } from "../../repositories/payroll/PayrollSetupRepository";
import { PayrollSetupInteractor } from "../../interactors/payroll/PayrollSetupInteractor";
import { PayrollSetupController } from "../../controllers/payroll/PayrollSetupController";
import { IPayrollSetupRepository } from "../../interfaces/payroll/IPayrollSetupRepository";
import { IPayrollSetupInteractor } from "../../interfaces/payroll/IPayrollSetupInteractor";

// Initialize Inversify container
const container = new Container();

// Bind PayrollSetup-related interfaces to their implementations
container.bind<IPayrollSetupRepository>(INTERFACE_TYPE.PayrollSetupRepository).to(PayrollSetupRepository);
container.bind<IPayrollSetupInteractor>(INTERFACE_TYPE.PayrollSetupInteractor).to(PayrollSetupInteractor);
container.bind(INTERFACE_TYPE.PayrollSetupController).to(PayrollSetupController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PayrollSetupController>(INTERFACE_TYPE.PayrollSetupController);

// Define the routes and bind controller methods
router.post("/create", controller.onCreatePayrollSetup.bind(controller));
router.get("/:id", controller.onGetPayrollSetup.bind(controller));
router.get("/", controller.onGetAllPayrollSetups.bind(controller));
router.patch("/:id", controller.onUpdatePayrollSetup.bind(controller));

// Export the configured router
export default router;
