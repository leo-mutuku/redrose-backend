import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { StoreRegisterController } from "../../controllers/store/StoreRegisterController";
import { IStoreRegisterRepository } from "../../interfaces/store/IStoreRegisterRepository";
import { IStoreRegisterInteractor } from "../../interfaces/store/IStoreRegisterInteractor";
import { StoreRegisterRepository } from "../../repositories/store/StoreRegisterRepository";
import { StoreRegisterInteractor } from "../../interactors/store/StoreRegisterInteractor";

// Initialize Inversify container
const container = new Container();

// Bind StoreRegister-related interfaces to their implementations
container.bind<IStoreRegisterRepository>(INTERFACE_TYPE.StoreRegisterRepository).to(StoreRegisterRepository);
container.bind<IStoreRegisterInteractor>(INTERFACE_TYPE.StoreRegisterInteractor).to(StoreRegisterInteractor);
container.bind(INTERFACE_TYPE.StoreRegisterController).to(StoreRegisterController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<StoreRegisterController>(INTERFACE_TYPE.StoreRegisterController);

// Define the routes and bind controller methods
router.post("/createregister", controller.onCreateRegister.bind(controller));
router.get("/getregister/:id", controller.onGetRegister.bind(controller));
router.get("/getregisters", controller.onGetRegisters.bind(controller));
router.patch("/updateregister/:id", controller.onUpdateRegister.bind(controller));

// Export the configured router
export default router;
