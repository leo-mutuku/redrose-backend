"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const SupplierRepository_1 = require("../../repositories/administration/SupplierRepository");
const SupplierInteractor_1 = require("../../interactors/administration/SupplierInteractor");
const suppliersController_1 = require("../../controllers/administration/suppliersController");
const container = new inversify_1.Container();
container.bind(utils_1.INTERFACE_TYPE.SupplierRepository).to(SupplierRepository_1.SupplierRepository);
container.bind(utils_1.INTERFACE_TYPE.SupplierInteractor).to(SupplierInteractor_1.SupplierInteractor);
container.bind(utils_1.INTERFACE_TYPE.SupplierController).to(suppliersController_1.SupplierController);
const router = (0, express_1.Router)();
const controller = container.get(utils_1.INTERFACE_TYPE.SupplierController);
router.post("/createsupplier", controller.onCreateSupplier.bind(controller));
router.get("/getsupplier/:id", controller.onGetSupplier.bind(controller));
router.get("/getsuppliers", controller.onGetSuppliers.bind(controller));
router.patch("/updatesupplier/:id", controller.onUpdateSupplier.bind(controller));
exports.default = router;
