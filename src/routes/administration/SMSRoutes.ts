import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ISMSLibrary } from "../../interfaces/ISMSLibrary";
import { SmsService } from "../../external-libraries/sms";
import { ISMSInteractor } from "../../interfaces/ISMSInteractor";
import { SMSInteractor } from "../../interactors/SMSInteractor";
import { SMSController } from "../../controllers/SMSController";





const container = new Container();

container.bind<ISMSLibrary>(INTERFACE_TYPE.SMSExternalLibrary).to(SmsService);
container.bind<ISMSInteractor>(INTERFACE_TYPE.SMSInteractor).to(SMSInteractor);
container.bind(INTERFACE_TYPE.SMSController).to(SMSController);


const router = Router();
const controller = container.get<SMSController>(INTERFACE_TYPE.SMSController);
router.post("/sendbulky", controller.sendBulky.bind(controller));
router.post("/sendsinglesms", controller.sendSingle.bind(controller));

export default router;