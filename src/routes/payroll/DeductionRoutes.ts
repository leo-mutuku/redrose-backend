import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { DeductionRepository } from "../../repositories/payroll/DeductionRepository";
import { DeductionInteractor } from "../../interactors/payroll/DeductionInteractor";
import { DeductionController } from "../../controllers/payroll/DeductionController";
import { IDeductionRepository } from "../../interfaces/payroll/IDeductionRepository";
import { IDeductionInteractor } from "../../interfaces/payroll/IDeductionInteractor";

// Initialize Inversify container
const container = new Container();

// Bind Deduction-related interfaces to their implementations
container.bind<IDeductionRepository>(INTERFACE_TYPE.DeductionRepository).to(DeductionRepository);
container.bind<IDeductionInteractor>(INTERFACE_TYPE.DeductionInteractor).to(DeductionInteractor);
container.bind(INTERFACE_TYPE.DeductionController).to(DeductionController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<DeductionController>(INTERFACE_TYPE.DeductionController);

// Define the routes and bind controller methods
router.post("/creatededuction", controller.onCreateDeduction.bind(controller));
router.get("/getdeduction/:id", controller.onGetDeduction.bind(controller));
router.get("/getdeductions", controller.onGetDeductions.bind(controller));
router.patch("/updatededuction/:id", controller.onUpdateDeduction.bind(controller));

// Export the configured router
export default router;
