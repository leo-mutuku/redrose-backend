import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IVendorRepository } from "../../interfaces/administation/IVendorRepository";
import { VendorRepository } from "../../repositories/administration/VendorRepository";
import { IVendorInteractor } from "../../interfaces/administation/IVendorInteractor";
import { VendorInteractor } from "../../interactors/administration/VendorInteractor";
import { VendorController } from "../../controllers/administration/vendorsController";


const container = new Container();
container.bind<IVendorRepository>(INTERFACE_TYPE.VendorRepository).to(VendorRepository)
container.bind<IVendorInteractor>(INTERFACE_TYPE.VendorInteractor).to(VendorInteractor)
container.bind<VendorController>(INTERFACE_TYPE.VendorController).to(VendorController)

const router = Router();
const controller = container.get<VendorController>(INTERFACE_TYPE.VendorController)
router.post("/createvendor", controller.onCreateVendor.bind(controller))
router.get("/getvendor/:id", controller.onGetVendor.bind(controller))
router.get("/getvendors", controller.onGetVendors.bind(controller))
router.put("/updatevendor", controller.onUpdateVendor.bind(controller))


export default router;