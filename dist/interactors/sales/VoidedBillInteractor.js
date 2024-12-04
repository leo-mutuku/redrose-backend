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
exports.VoidedBillInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let VoidedBillInteractor = class VoidedBillInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    createVoidedBill(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.createVoidedBill(input);
                // Business logic can be added here if needed
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error occurred in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to create voided bill. Please try again later.');
            }
        });
    }
    getVoidedBill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getVoidedBill(id);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Failed to retrieve voided bill with ID ${id}. Reason: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Error occurred in VoidedBillInteractor. Please try again later.');
            }
        });
    }
    updateVoidedBill(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.updateVoidedBill(id, input);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error updating voided bill in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to update voided bill. Please try again later.');
            }
        });
    }
    getVoidedBills(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getVoidedBills(limit, offset);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error fetching voided bills in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to retrieve voided bills. Please try again later.');
            }
        });
    }
};
exports.VoidedBillInteractor = VoidedBillInteractor;
exports.VoidedBillInteractor = VoidedBillInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.VoidedBillRepository))
], VoidedBillInteractor);
