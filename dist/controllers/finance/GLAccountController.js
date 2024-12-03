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
exports.GLAccountController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let GLAccountController = class GLAccountController {
    constructor(glAccountInteractor) {
        this.glAccountInteractor = glAccountInteractor;
    }
    onCreateGLAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const glAccountData = req.body;
                const newGLAccount = yield this.glAccountInteractor.createGLAccount(glAccountData);
                res.status(201).json({ success: true, data: newGLAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetGLAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const glAccountId = parseInt(req.params.id);
                const glAccount = yield this.glAccountInteractor.getGLAccountById(glAccountId);
                res.status(200).json({ success: true, data: glAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetGLAccounts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const glAccounts = yield this.glAccountInteractor.getAllGLAccounts(limit, offset);
                res.status(200).json({ success: true, data: glAccounts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateGLAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const glAccountId = parseInt(req.params.id);
                const updateData = req.body;
                const updatedGLAccount = yield this.glAccountInteractor.updateGLAccount(glAccountId, updateData);
                res.status(200).json({ success: true, data: updatedGLAccount });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onDeleteGLAccount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const glAccountId = parseInt(req.params.id);
                yield this.glAccountInteractor.deleteGLAccount(glAccountId);
                res.status(200).json({ success: true, message: "GL Account deleted successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.GLAccountController = GLAccountController;
exports.GLAccountController = GLAccountController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.GLAccountInteractor))
], GLAccountController);
