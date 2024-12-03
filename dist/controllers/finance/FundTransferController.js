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
exports.FundTransferController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let FundTransferController = class FundTransferController {
    constructor(fundTransferInteractor) {
        this.fundTransferInteractor = fundTransferInteractor;
    }
    onInitiateFundTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transferData = req.body;
                const initiatedTransfer = yield this.fundTransferInteractor.initiateFundTransfer(transferData);
                res.status(201).json({ success: true, data: initiatedTransfer });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetFundTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transferId = parseInt(req.params.id);
                const transferDetails = yield this.fundTransferInteractor.getFundTransferById(transferId);
                res.status(200).json({ success: true, data: transferDetails });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetAllFundTransfers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const fundTransfers = yield this.fundTransferInteractor.getAllFundTransfers(limit, offset);
                res.status(200).json({ success: true, data: fundTransfers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateFundTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transferId = parseInt(req.params.id);
                const updateData = req.body;
                const updatedTransfer = yield this.fundTransferInteractor.updateFundTransfer(transferId, updateData);
                res.status(200).json({ success: true, data: updatedTransfer });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onDeleteFundTransfer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transferId = parseInt(req.params.id);
                yield this.fundTransferInteractor.deleteFundTransfer(transferId);
                res.status(200).json({ success: true, message: "Fund transfer deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.FundTransferController = FundTransferController;
exports.FundTransferController = FundTransferController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.FundTransferInteractor))
], FundTransferController);
