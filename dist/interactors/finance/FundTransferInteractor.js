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
exports.FundTransferInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let FundTransferInteractor = class FundTransferInteractor {
    constructor(fundTransferRepository) {
        this.fundTransferRepository = fundTransferRepository;
    }
    initiateFundTransfer(transferData) {
        throw new Error("Method not implemented.");
    }
    createFundTransfer(fundTransferData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fundTransferRepository.createFundTransfer(fundTransferData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create fund transfer: " + error, 500);
            }
        });
    }
    getFundTransferById(transfer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fundTransfer = yield this.fundTransferRepository.getFundTransferById(transfer_id);
                if (!fundTransfer) {
                    throw new AppError_1.AppError(`Fund transfer with ID ${transfer_id} not found.`);
                }
                return fundTransfer;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch fund transfer: " + error, 500);
            }
        });
    }
    getAllFundTransfers(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fundTransferRepository.getAllFundTransfers(limit, offset);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch fund transfers: " + error, 500);
            }
        });
    }
    updateFundTransfer(transfer_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.fundTransferRepository.updateFundTransfer(transfer_id, updateData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update fund transfer: " + error, 500);
            }
        });
    }
    deleteFundTransfer(transferId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fundTransferRepository.deleteFundTransfer(transferId);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete fund transfer: " + error, 500);
            }
        });
    }
};
exports.FundTransferInteractor = FundTransferInteractor;
exports.FundTransferInteractor = FundTransferInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.FundTransferRepository))
], FundTransferInteractor);
