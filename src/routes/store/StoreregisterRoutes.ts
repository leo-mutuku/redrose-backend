import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { StoreRegisterInteractor } from "../../interactors/store/StoreRegisterInteractor";
import { IStoreRegisterInteractor } from "../../interfaces/store/IStoreRegisterInteractor";
import { StoreRegisterController } from "../../controllers/store/StoreregisterController";
import { IStoreRegisterRepository } from "../../interfaces/store/IStoreRegisterRepository";
import { StoreRegisterRepository } from "../../repositories/store/StoreRegisterRepository";


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
router.post("/createstore", controller.onCreateRegister.bind(controller));
router.get("/getstore/:id", controller.onGetRegister.bind(controller));
router.get("/getstores", controller.onGetRegisters.bind(controller));
router.patch("/updatestore/:id", controller.onUpdateRegister.bind(controller));

// Export the configured router
export default router;
