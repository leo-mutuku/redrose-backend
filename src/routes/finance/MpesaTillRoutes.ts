import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMpesaTillRepository } from "../../interfaces/finance/IMpesaTillRepository";
import { IMpesaTillInteractor } from "../../interfaces/finance/IMpesaTillInteractor";
import { MpesaTillInteractor } from "../../interactors/finance/MpesaTillInteractor";
import { MpesaTillController } from "../../controllers/finance/MpesaTillController";
import { MpesaTillRepository } from "../../repositories/finance/MpesaTillRepository";

// Create the Inversify container
const container = new Container();

// Bind interfaces to their implementations
container.bind<IMpesaTillRepository>(INTERFACE_TYPE.MpesaTillRepository).to(MpesaTillRepository);
container.bind<IMpesaTillInteractor>(INTERFACE_TYPE.MpesaTillInteractor).to(MpesaTillInteractor);
container.bind(INTERFACE_TYPE.MpesaTillController).to(MpesaTillController);

// Initialize the router
const router = Router();
const controller = container.get<MpesaTillController>(INTERFACE_TYPE.MpesaTillController);

// Define routes for Mpesa Till operations
router.post("/creatempesatill", controller.onCreateMpesaTill.bind(controller));
router.get("/gettill/:id", controller.onGetMpesaTill.bind(controller));
router.get("/gettills", controller.onGetMpesaTills.bind(controller));
router.patch("/updatetill/:id", controller.onUpdateMpesaTill.bind(controller));
router.delete("/deletetill/:id", controller.onDeleteMpesaTill.bind(controller));

export default router;
