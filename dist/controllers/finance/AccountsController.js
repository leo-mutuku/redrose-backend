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
exports.AccountController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let AccountController = class AccountController {
    constructor(accountInteractor) {
        this.accountInteractor = accountInteractor;
    }
    onCreateAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accountData = req.body;
                const newAccount = yield this.accountInteractor.createAccount(accountData);
                res.status(201).json({ success: true, data: newAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account_id = parseInt(req.params.id);
                const account = yield this.accountInteractor.getAccountById(account_id);
                res.status(200).json({ success: true, data: account });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetAccounts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const accounts = yield this.accountInteractor.getAllAccounts(limit, offset);
                res.status(200).json({ success: true, data: accounts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.body", req.body);
                const account_id = parseInt(req.params.id);
                const updateData = req.body;
                const updatedAccount = yield this.accountInteractor.updateAccount(account_id, updateData);
                res.status(200).json({ success: true, data: updatedAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onDeleteAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account_id = parseInt(req.params.id);
                yield this.accountInteractor.deleteAccount(account_id);
                res.status(200).json({ success: true, message: "Account deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.AccountController = AccountController;
exports.AccountController = AccountController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AccountInteractor))
], AccountController);
