import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { WaitStaffRegisterRepository } from "../../repositories/sales/WaitStaffRegisterRepository";
import { WaitStaffRegisterInteractor } from "../../interactors/sales/WaitStaffRegisterInteractor";
import { WaitStaffRegisterController } from "../../controllers/sales/WaitStaffRegisterController";
import { IWaitStaffRegisterRepository } from "../../interfaces/sales/IWaitStaffRegisterRepository";
import { IWaitStaffRegisterInteractor } from "../../interfaces/sales/IWaitStaffRegisterInteractor";

// Initialize Inversify container
const container = new Container();

// Bind WaitStaffRegister-related interfaces to their implementations
container.bind<IWaitStaffRegisterRepository>(INTERFACE_TYPE.WaitStaffRegisterRepository).to(WaitStaffRegisterRepository);
container.bind<IWaitStaffRegisterInteractor>(INTERFACE_TYPE.WaitStaffRegisterInteractor).to(WaitStaffRegisterInteractor);
container.bind(INTERFACE_TYPE.WaitStaffRegisterController).to(WaitStaffRegisterController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<WaitStaffRegisterController>(INTERFACE_TYPE.WaitStaffRegisterController);

// Define the routes and bind controller methods
router.post("/createwaitstaffregister", controller.onCreateWaitStaffRegister.bind(controller));
router.get("/getwaitstaffregister/:id", controller.onGetWaitStaffRegister.bind(controller));
router.get("/getwaitstaffregisters", controller.onGetWaitStaffRegisters.bind(controller));
router.patch("/updatewaitstaffregister/:id", controller.onUpdateWaitStaffRegister.bind(controller));

// Export the configured router
export default router;
