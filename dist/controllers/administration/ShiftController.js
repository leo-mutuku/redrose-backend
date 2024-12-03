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
exports.ShiftController = void 0;
const inversify_1 = require("inversify");
const utils_1 = require("../../utils");
let ShiftController = class ShiftController {
    constructor(shiftInteractor) {
        this.shiftInteractor = shiftInteractor;
    }
    onCreateShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const result = yield this.shiftInteractor.createShift(body);
                res.status(201).json({
                    status: "success",
                    message: "Shift created successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onUpdateShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const id = parseInt(req.params.id);
                const result = yield this.shiftInteractor.updateShift(id, body);
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetShift(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const result = yield this.shiftInteractor.getShift(id);
                res.status(200).json({
                    status: "success",
                    message: "Shift fetched successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    onGetShifts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = parseInt(req.query.limit) || 20;
                const offset = parseInt(req.query.offset) || 0;
                const result = yield this.shiftInteractor.getShifts(limit, offset);
                res.status(200).json({
                    status: "success",
                    message: "Shifts fetched successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.ShiftController = ShiftController;
exports.ShiftController = ShiftController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(utils_1.INTERFACE_TYPE.ShiftInteractor))
], ShiftController);
