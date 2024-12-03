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
exports.GLAccountInteractor = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
const AppError_1 = require("../../utils/AppError");
let GLAccountInteractor = class GLAccountInteractor {
    constructor(glAccountRepository) {
        this.glAccountRepository = glAccountRepository;
    }
    createGLAccount(glAccountData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.glAccountRepository.createGLAccount(glAccountData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create GL account: " + error, 500);
            }
        });
    }
    getGLAccountById(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const glAccount = yield this.glAccountRepository.getGLAccountById(account_id);
                if (!glAccount) {
                    throw new AppError_1.AppError(`GL account with ID ${account_id} not found.`);
                }
                return glAccount;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch GL account: " + error, 500);
            }
        });
    }
    getAllGLAccounts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.glAccountRepository.getAllGLAccounts(limit, offset);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to fetch GL accounts: " + error, 500);
            }
        });
    }
    updateGLAccount(account_id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.glAccountRepository.updateGLAccount(account_id, updateData);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update GL account: " + error, 500);
            }
        });
    }
    deleteGLAccount(accountId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.glAccountRepository.deleteGLAccount(accountId);
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete GL account: " + error, 500);
            }
        });
    }
};
exports.GLAccountInteractor = GLAccountInteractor;
exports.GLAccountInteractor = GLAccountInteractor = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.GLAccountRepository))
], GLAccountInteractor);
