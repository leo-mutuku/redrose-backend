"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.ShiftRepository = void 0;
const dbConnection_1 = require("../../dbConnection");
const inversify_1 = require("inversify");
const AppError_1 = require("../../utils/AppError");
let ShiftRepository = class ShiftRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createShift(shift) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.query(`INSERT INTO shift (shift_start, shift_end, created_by)
                 VALUES ($1, $2, $3) 
                RETURNING *`, [shift.shift_start, shift.shift_end, shift.created_by]);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error creating shift" + error, 500);
            }
        });
    }
    getShift(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.query(`SELECT * FROM shift WHERE shift_id = $1`, [id]);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error getting shift" + error, 500);
            }
        });
    }
    getShifts(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(limit, offset);
                const result = yield this.client.query(`SELECT * FROM shift  Limit $1  OFFSET $2`, [limit, offset]);
                console.log(result.rows);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Error getting shifts" + error, 500);
            }
        });
    }
    updateShift(id, shift) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.query(`UPDATE shifts SET shift_start = $1, shift_end = $2 WHERE shift_id = $3 RETURNING *`, [shift.shift_start, shift.shift_end, id]);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error updating shift", 500);
            }
        });
    }
};
exports.ShiftRepository = ShiftRepository;
exports.ShiftRepository = ShiftRepository = __decorate([
    (0, inversify_1.injectable)()
], ShiftRepository);
