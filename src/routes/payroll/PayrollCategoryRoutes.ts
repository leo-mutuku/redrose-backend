import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PayrollCategoryRepository } from "../../repositories/payroll/PayrollCategoryRepository";
import { PayrollCategoryInteractor } from "../../interactors/payroll/PayrollCategoryInteractor";
import { PayrollCategoryController } from "../../controllers/payroll/PayrollCategoryController";
import { IPayrollCategoryRepository } from "../../interfaces/payroll/IPayrollCategoryRepository";
import { IPayrollCategoryInteractor } from "../../interfaces/payroll/IPayrollCategoryInteractor";

// Initialize Inversify container
const container = new Container();

// Bind PayrollCategory-related interfaces to their implementations
container.bind<IPayrollCategoryRepository>(INTERFACE_TYPE.PayrollCategoryRepository).to(PayrollCategoryRepository);
container.bind<IPayrollCategoryInteractor>(INTERFACE_TYPE.PayrollCategoryInteractor).to(PayrollCategoryInteractor);
container.bind(INTERFACE_TYPE.PayrollCategoryController).to(PayrollCategoryController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PayrollCategoryController>(INTERFACE_TYPE.PayrollCategoryController);

// Define the routes and bind controller methods
router.post("/create", controller.onCreatePayrollCategory.bind(controller));
router.get("/:id", controller.onGetPayrollCategory.bind(controller));
router.get("/", controller.onGetPayrollCategories.bind(controller));
router.patch("/:id", controller.onUpdatePayrollCategory.bind(controller));

// Export the configured router
export default router;
