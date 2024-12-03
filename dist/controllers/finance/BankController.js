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
exports.BankController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let BankController = class BankController {
    constructor(bankInteractor) {
        this.bankInteractor = bankInteractor;
    }
    onCreateBank(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankData = req.body;
                const newBank = yield this.bankInteractor.createBank(bankData);
                res.status(201).json({ success: true, data: newBank });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetBank(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankId = parseInt(req.params.id);
                const bank = yield this.bankInteractor.getBankById(bankId);
                res.status(200).json({ success: true, data: bank });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetBanks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const banks = yield this.bankInteractor.getAllBanks(limit, offset);
                res.status(200).json({ success: true, data: banks });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateBank(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankId = parseInt(req.params.id);
                const updateData = req.body;
                const updatedBank = yield this.bankInteractor.updateBank(bankId, updateData);
                res.status(200).json({ success: true, data: updatedBank });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onDeleteBank(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankId = parseInt(req.params.id);
                yield this.bankInteractor.deleteBank(bankId);
                res.status(200).json({ success: true, message: "Bank deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.BankController = BankController;
exports.BankController = BankController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.BankInteractor))
], BankController);
