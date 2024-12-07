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
exports.UserController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let UserController = class UserController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    onCreateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const data = yield this.interactor.createUser(body);
                res.status(201).json({ status: 'success', data: data, message: 'User created successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = parseInt(req.query.offset) || 0;
                const limit = parseInt(req.query.limit) || 10;
                const data = yield this.interactor.getUsers(limit, offset);
                res.status(200).json({ status: 'success', data: data, message: 'Users fetched successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('get user', req.body.user);
                console.log(req.params.id);
                const id = parseInt(req.params.id);
                const data = yield this.interactor.getUser(id);
                res.status(200).json({ status: 'success', data: data, message: 'User fetched successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const body = req.body;
                const data = yield this.interactor.updateUser(id, body);
                res.status(200).json({ status: 'success', data: data, message: 'User updated successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.UserInteractor))
], UserController);
