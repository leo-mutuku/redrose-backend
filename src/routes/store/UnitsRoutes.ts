import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { UnitController } from "../../controllers/store/UnitController";
import { IUnitRepository } from "../../interfaces/store/IUnitRepository";
import { IUnitInteractor } from "../../interfaces/store/IUnitInteractor";
import { UnitRepository } from "../../repositories/store/UnitRepository";
import { UnitInteractor } from "../../interactors/store/UnitInteractor";


// Initialize Inversify container
const container = new Container();

// Bind Unit-related interfaces to their implementations
container.bind<IUnitRepository>(INTERFACE_TYPE.UnitRepository).to(UnitRepository);
container.bind<IUnitInteractor>(INTERFACE_TYPE.UnitInteractor).to(UnitInteractor);
container.bind(INTERFACE_TYPE.UnitController).to(UnitController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<UnitController>(INTERFACE_TYPE.UnitController);

// Define the routes and bind controller methods
router.post("/createunit", controller.onCreateUnit.bind(controller));
router.get("/getunit/:id", controller.onGetUnit.bind(controller));
router.get("/getunits", controller.onGetUnits.bind(controller));
router.patch("/updateunit/:id", controller.onUpdateUnit.bind(controller));

// Export the configured router
export default router;
