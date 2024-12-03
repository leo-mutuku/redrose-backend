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
exports.CashAccountController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let CashAccountController = class CashAccountController {
    constructor(cashAccountInteractor) {
        this.cashAccountInteractor = cashAccountInteractor;
    }
    onCreateCashAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cashAccountData = req.body;
                const newCashAccount = yield this.cashAccountInteractor.createCashAccount(cashAccountData);
                res.status(201).json({ success: true, data: newCashAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetCashAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cashAccountId = parseInt(req.params.id);
                const cashAccount = yield this.cashAccountInteractor.getCashAccountById(cashAccountId);
                res.status(200).json({ success: true, data: cashAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetCashAccounts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const cashAccounts = yield this.cashAccountInteractor.getAllCashAccounts(limit, offset);
                res.status(200).json({ success: true, data: cashAccounts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateCashAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cashAccountId = parseInt(req.params.id);
                const updateData = req.body;
                const updatedCashAccount = yield this.cashAccountInteractor.updateCashAccount(cashAccountId, updateData);
                res.status(200).json({ success: true, data: updatedCashAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onDeleteCashAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cashAccountId = parseInt(req.params.id);
                yield this.cashAccountInteractor.deleteCashAccount(cashAccountId);
                res.status(200).json({ success: true, message: "Cash account deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.CashAccountController = CashAccountController;
exports.CashAccountController = CashAccountController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.CashAccountInteractor))
], CashAccountController);
