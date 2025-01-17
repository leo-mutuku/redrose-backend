import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { PrintBillController } from "../../controllers/sales/PrintBillController";
import { IPrintBillInteractor } from "../../interfaces/sales/IPrintBillInteractor";



const container = new Container

container.bind(INTERFACE_TYPE.PrintBillController).to(PrintBillController)



const router = Router();

const controller = container.get<PrintBillController>(INTERFACE_TYPE.PrintBillController)
router.post('/printpos', controller.printPos.bind(controller))




export default router;









