"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_1 = require("inversify");
const utils_1 = require("../utils");
const productRepository_1 = require("../repositories/productRepository");
const productInteractor_1 = require("../interactors/productInteractor");
const mailer_1 = require("../external-libraries/mailer");
const messageBroker_1 = require("../external-libraries/messageBroker");
const productController_1 = require("../controllers/productController");
const container = new inversify_1.Container();
container
    .bind(utils_1.INTERFACE_TYPE.ProductRepository)
    .to(productRepository_1.ProductRepository);
container
    .bind(utils_1.INTERFACE_TYPE.ProductInteractor)
    .to(productInteractor_1.ProductInteractor);
container.bind(utils_1.INTERFACE_TYPE.Mailer).to(mailer_1.Mailer);
container.bind(utils_1.INTERFACE_TYPE.MessageBroker).to(messageBroker_1.MessageBroker);
container.bind(utils_1.INTERFACE_TYPE.ProductController).to(productController_1.ProductController);
const route = express_1.default.Router();
const controller = container.get(utils_1.INTERFACE_TYPE.ProductController);
route.post("/products", controller.onCreateProduct.bind(controller));
route.get("/products", controller.onGetProducts.bind(controller));
route.patch("/products/:id", controller.onUpdateStock.bind(controller));
exports.default = route;
