import { Router } from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IPaymentVoucherRepository } from "../../interfaces/payment/IPaymentVoucherRepository";
import { IPaymentVoucherInteractor } from "../../interfaces/payment/IPaymentVocherInteractor";
import { PaymentVoucherController } from "../../controllers/payment/PaymentVoucherController";
import { PaymentVoucherRepository } from "../../repositories/payment/PaymentVoucherRepository";
import { PaymentVoucherInteractor } from "../../interactors/payment/PaymentVoucherInteractor";


// Initialize Inversify container
const container = new Container();

// Bind PaymentVoucher-related interfaces to their implementations
container.bind<IPaymentVoucherRepository>(INTERFACE_TYPE.PaymentVoucherRepository).to(PaymentVoucherRepository);
container.bind<IPaymentVoucherInteractor>(INTERFACE_TYPE.PaymentVoucherInteractor).to(PaymentVoucherInteractor);
container.bind(INTERFACE_TYPE.PaymentVoucherController).to(PaymentVoucherController);

// Create the router instance
const router = Router();

// Get the controller instance
const controller = container.get<PaymentVoucherController>(INTERFACE_TYPE.PaymentVoucherController);

// Define the routes and bind controller methods
router.post("/create", controller.onCreatePaymentVoucher.bind(controller));
router.get("/:id", controller.onGetPaymentVoucher.bind(controller));
router.get("/", controller.onGetPaymentVouchers.bind(controller));
router.patch("/:id", controller.onUpdatePaymentVoucher.bind(controller));

// Export the configured router
export default router;
