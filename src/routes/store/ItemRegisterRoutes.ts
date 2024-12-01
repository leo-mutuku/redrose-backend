import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IItemRegisterRepository } from "../../interfaces/store/IItemRegisterRepository";
import { IItemRegisterInteractor } from "../../interfaces/store/IItemRegisterInteractor";
import { ItemRegisterInteractor } from "../../interactors/store/ItemRegisterInteractor";
import { ItemRegisterRepository } from "../../repositories/store/ItemRegisterRepository";
import { ItemRegisterController } from "../../controllers/store/ItemregisterController";

// Initialize Inversify container
const container = new Container();

// Bind Item Register-related interfaces to their implementations
container.bind<IItemRegisterRepository>(INTERFACE_TYPE.ItemRegisterRepository).to(ItemRegisterRepository);
container.bind<IItemRegisterInteractor>(INTERFACE_TYPE.ItemRegisterInteractor).to(ItemRegisterInteractor);
container.bind(INTERFACE_TYPE.ItemRegisterController).to(ItemRegisterController);  // Adjusted controller binding

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<ItemRegisterController>(INTERFACE_TYPE.ItemRegisterController);

// Define the routes and bind controller methods
router.post("/createitem", controller.onCreateRegister.bind(controller));  // Adjusted route
router.get("/getitem/:id", controller.onGetRegister.bind(controller));  // Adjusted route
router.get("/getitems", controller.onGetRegisters.bind(controller));  // Adjusted route
router.patch("/updateitem/:id", controller.onUpdateRegister.bind(controller));  // Adjusted route

// Export the configured router
export default router;
