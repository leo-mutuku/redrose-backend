"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../utils");
let ProductInteractor = class ProductInteractor {
    constructor(repository, mailer, broker) {
        this.repository = repository;
        (this.mailer = mailer), (this.broker = broker);
    }
    createProduct(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.create(input);
            // do some checks
            yield this.broker.NotifyToPromotionService(data);
            return data;
        });
    }
    updateStock(id, stock) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repository.update(id, stock);
            yield this.mailer.SendEmail("someone@someone.com", data);
            return data;
        });
    }
    getProducts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.find(limit, offset);
        });
    }
};
exports.ProductInteractor = ProductInteractor;
exports.ProductInteractor = ProductInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ProductRepository)),
    __param(1, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.Mailer)),
    __param(2, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.MessageBroker))
], ProductInteractor);
