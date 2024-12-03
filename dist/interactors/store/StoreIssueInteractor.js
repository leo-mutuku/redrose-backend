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
exports.StoreIssueInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let StoreIssueInteractor = class StoreIssueInteractor {
    constructor(repository) {
        this.repository = repository;
    }
    createStoreIssue(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.createStoreIssue(input);
                // Additional business logic can be added here
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error occurred in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to create store issue. Please try again later.');
            }
        });
    }
    getStoreIssue(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getStoreIssue(id);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Failed to retrieve store issue with ID ${id}. Reason: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Error occurred in StoreIssueInteractor. Please try again later.');
            }
        });
    }
    updateStoreIssue(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.updateStoreIssue(id, input);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error updating store issue in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to update store issue. Please try again later.');
            }
        });
    }
    getStoreIssues(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.getStoreIssues(limit, offset);
                return result;
            }
            catch (error) {
                if (error instanceof AppError_1.AppError) {
                    throw new AppError_1.AppError(`Error fetching store issues in StoreIssueInteractor: ${error.message}`, error.statusCode || 500);
                }
                throw new Error('Failed to retrieve store issues. Please try again later.');
            }
        });
    }
};
exports.StoreIssueInteractor = StoreIssueInteractor;
exports.StoreIssueInteractor = StoreIssueInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.StoreIssueRepository))
], StoreIssueInteractor);
