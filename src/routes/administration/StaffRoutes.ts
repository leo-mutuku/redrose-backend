import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { StaffRepository } from "../../repositories/administration/StaffRepository";
import { IStaffInteractor } from "../../interfaces/administation/IStaffInteractor";
import { StaffInteractor } from "../../interactors/administration/StaffInteractor";
import { StaffController } from "../../controllers/administration/StaffController";

const container = new Container();
container.bind<IStaffRepository>(INTERFACE_TYPE.StaffRepository).to(StaffRepository);
container.bind<IStaffInteractor>(INTERFACE_TYPE.StaffInteractor).to(StaffInteractor);
container.bind<StaffController>(INTERFACE_TYPE.StaffController).to(StaffController);

const router = Router();
const controller = container.get<StaffController>(INTERFACE_TYPE.StaffController);
router.post("/createstaff", controller.onCreateStaff.bind(controller));
router.get("/getstaff/:id", controller.onGetStaff.bind(controller));
router.get("/getstaffs", controller.onGetStaffs.bind(controller));
router.patch("/updatestaff/:id", controller.onUpdateStaff.bind(controller));


export default router;
