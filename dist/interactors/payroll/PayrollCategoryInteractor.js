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
exports.PayrollCategoryInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let PayrollCategoryInteractor = class PayrollCategoryInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    createPayrollCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.createPayrollCategory(input);
                // Business logic can be added here if needed
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error occurred in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to create payroll category. Please try again later.');
            }
        });
    }
    getPayrollCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getPayrollCategory(id);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Failed to retrieve payroll category with ID ${id}. Reason: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Error occurred in PayrollCategoryInteractor. Please try again later.');
            }
        });
    }
    updatePayrollCategory(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.updatePayrollCategory(id, input);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error updating payroll category in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to update payroll category. Please try again later.');
            }
        });
    }
    getPayrollCategories(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getPayrollCategories(limit, offset);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error fetching payroll categories in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to retrieve payroll categories. Please try again later.');
            }
        });
    }
};
exports.PayrollCategoryInteractor = PayrollCategoryInteractor;
exports.PayrollCategoryInteractor = PayrollCategoryInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.PayrollCategoryRepository))
], PayrollCategoryInteractor);
