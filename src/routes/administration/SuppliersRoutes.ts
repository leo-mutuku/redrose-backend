import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ISupplierRepository } from "../../interfaces/administation/ISupplierRepository";
import { SupplierRepository } from "../../repositories/administration/SupplierRepository";
import { ISupplierInteractor } from "../../interfaces/administation/ISupplierInteractor";
import { SupplierInteractor } from "../../interactors/administration/SupplierInteractor";
import { SupplierController } from "../../controllers/administration/suppliersController";


const container = new Container();
container.bind<ISupplierRepository>(INTERFACE_TYPE.SupplierRepository).to(SupplierRepository)
container.bind<ISupplierInteractor>(INTERFACE_TYPE.SupplierInteractor).to(SupplierInteractor)
container.bind<SupplierController>(INTERFACE_TYPE.SupplierController).to(SupplierController)

const router = Router();
const controller = container.get<SupplierController>(INTERFACE_TYPE.SupplierController)
router.post("/createsupplier", controller.onCreateSupplier.bind(controller))
router.get("/getsupplier/:id", controller.onGetSupplier.bind(controller))
router.get("/getsuppliers", controller.onGetSuppliers.bind(controller))
router.patch("/updatesupplier/:id", controller.onUpdateSupplier.bind(controller))

export default router;