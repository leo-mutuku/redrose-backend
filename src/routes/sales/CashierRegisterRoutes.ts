import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { CashierRegisterRepository } from "../../repositories/sales/CashierRegisterRepository";
import { CashierRegisterInteractor } from "../../interactors/sales/CashierRegisterInteractor";
import { CashierRegisterController } from "../../controllers/sales/CashierRegisterController";
import { ICashierRegisterRepository } from "../../interfaces/sales/ICashierRegisterRepository";
import { ICashierRegisterInteractor } from "../../interfaces/sales/ICashierRegisterInteractor";

// Initialize Inversify container
const container = new Container();

// Bind CashierRegister-related interfaces to their implementations
container.bind<ICashierRegisterRepository>(INTERFACE_TYPE.CashierRegisterRepository).to(CashierRegisterRepository);
container.bind<ICashierRegisterInteractor>(INTERFACE_TYPE.CashierRegisterInteractor).to(CashierRegisterInteractor);
container.bind(INTERFACE_TYPE.CashierRegisterController).to(CashierRegisterController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<CashierRegisterController>(INTERFACE_TYPE.CashierRegisterController);

// Define the routes and bind controller methods
router.post("/createcashierregister", controller.onCreateCashierRegister.bind(controller));
router.get("/getcashierregister/:id", controller.onGetCashierRegister.bind(controller));
router.get("/getcashierregisters", controller.onGetCashierRegisters.bind(controller));
router.patch("/updatecashierregister/:id", controller.onUpdateCashierRegister.bind(controller));

// Export the configured router
export default router;
