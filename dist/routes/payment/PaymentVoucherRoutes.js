"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const PaymentVoucherRepository_1 = require("../../repositories/payroll/PaymentVoucherRepository");
const PaymentVoucherInteractor_1 = require("../../interactors/payroll/PaymentVoucherInteractor");
const PaymentVoucherController_1 = require("../../controllers/payroll/PaymentVoucherController");
// Initialize Inversify container
const container = new inversify_1.Container();
// Bind PaymentVoucher-related interfaces to their implementations
container.bind(utils_1.INTERFACE_TYPE.PaymentVoucherRepository).to(PaymentVoucherRepository_1.PaymentVoucherRepository);
container.bind(utils_1.INTERFACE_TYPE.PaymentVoucherInteractor).to(PaymentVoucherInteractor_1.PaymentVoucherInteractor);
container.bind(utils_1.INTERFACE_TYPE.PaymentVoucherController).to(PaymentVoucherController_1.PaymentVoucherController);
// Create the router instance
const router = (0, express_1.Router)();
// Get the controller instance
const controller = container.get(utils_1.INTERFACE_TYPE.PaymentVoucherController);
// Define the routes and bind controller methods
router.post("/create", controller.onCreatePaymentVoucher.bind(controller));
router.get("/:id", controller.onGetPaymentVoucher.bind(controller));
router.get("/", controller.onGetPaymentVouchers.bind(controller));
router.patch("/:id", controller.onUpdatePaymentVoucher.bind(controller));
// Export the configured router
exports.default = router;
