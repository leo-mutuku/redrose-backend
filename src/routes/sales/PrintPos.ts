import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PrintPosController } from "../../controllers/sales/PrintPos";



const container = new Container

container.bind(INTERFACE_TYPE.POSPrintController).to(PrintPosController)


const router = Router();

const controller = container.get<PrintPosController>(INTERFACE_TYPE.POSPrintController)
router.post('/printpos', controller.printPos.bind(controller))



export default router;









