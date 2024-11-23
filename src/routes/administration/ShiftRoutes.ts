import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IShiftRepository } from "../../interfaces/administation/IShiftRepository";
import { ShiftRepository } from "../../repositories/administration/ShiftRepository";
import { IShiftInteractor } from "../../interfaces/administation/IShiftInteractor";
import { ShiftInteractor } from "../../interactors/administration/ShiftInterator";
import { ShiftController } from "../../controllers/administration/ShiftController";


const container = new Container();

container.bind<IShiftRepository>(INTERFACE_TYPE.ShiftRepository).to(ShiftRepository);
container.bind<IShiftInteractor>(INTERFACE_TYPE.ShiftInteractor).to(ShiftInteractor);
container.bind<ShiftController>(INTERFACE_TYPE.ShiftController).to(ShiftController);

const router = Router();
const controller = container.get<ShiftController>(INTERFACE_TYPE.ShiftController);
router.post("/createshift", controller.onCreateShift.bind(controller));
router.put("/updateShift/:id", controller.onUpdateShift.bind(controller));
router.get("/getShift/:id", controller.onGetShift.bind(controller));
router.get("/getShifts", controller.onGetShifts.bind(controller));

export default router;
