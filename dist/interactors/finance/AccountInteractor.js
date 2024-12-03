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
exports.AccountInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let AccountInteractor = class AccountInteractor {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    createAccount(accountData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.accountRepository.createAccount(accountData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create account: " + error, 500);
            }
        });
    }
    getAccountById(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield this.accountRepository.getAccountById(account_id);
                if (!account) {
                    throw new AppError_1.AppError(`Account with ID ${account_id} not found.`);
                }
                return account;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch account: " + error, 500);
            }
        });
    }
    getAllAccounts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.accountRepository.getAllAccounts(limit, offset);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch accounts: " + error, 500);
            }
        });
    }
    updateAccount(account_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.accountRepository.updateAccount(account_id, updateData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update account: " + error, 500);
            }
        });
    }
    deleteAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.accountRepository.deleteAccount(accountId);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete account: " + error, 500);
            }
        });
    }
};
exports.AccountInteractor = AccountInteractor;
exports.AccountInteractor = AccountInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.AccountRepository))
], AccountInteractor);
