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
exports.MpesaTillRepository = void 0;
const AppError_1 = require("../../utils/AppError");
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
let MpesaTillRepository = class MpesaTillRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createMpesaTill(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                INSERT INTO mpesa_tills (till_number, business_name, balance, created_at)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
                const values = [
                    input.till_number,
                    input.business_name,
                    input.balance,
                    input.created_at || new Date(),
                ];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to create Mpesa till: " + error, 500);
            }
        });
    }
    getMpesaTillById(tillNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM mpesa_tills WHERE till_number = $1;
            `;
                const result = yield this.client.query(query, [tillNumber]);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Mpesa till with number ${tillNumber} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get Mpesa till: " + error, 500);
            }
        });
    }
    updateMpesaTill(tillNumber, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                UPDATE mpesa_tills
                SET business_name = $1, balance = $2, updated_at = $3
                WHERE till_number = $4
                RETURNING *;
            `;
                const values = [
                    input.business_name,
                    input.balance,
                    new Date(),
                    tillNumber,
                ];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError(`Mpesa till with number ${tillNumber} not found`, 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to update Mpesa till: " + error, 500);
            }
        });
    }
    getAllMpesaTill(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT * FROM mpesa_tills
                LIMIT $1 OFFSET $2;
            `;
                const result = yield this.client.query(query, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to get Mpesa tills: " + error, 500);
            }
        });
    }
    deleteMpesaTill(tillNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM mpesa_tills WHERE till_number = $1;
            `;
                const result = yield this.client.query(query, [tillNumber]);
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError(`Mpesa till with number ${tillNumber} not found`, 404);
                }
            }
            catch (error) {
                throw new AppError_1.AppError("Failed to delete Mpesa till: " + error, 500);
            }
        });
    }
};
exports.MpesaTillRepository = MpesaTillRepository;
exports.MpesaTillRepository = MpesaTillRepository = __decorate([
    (0, inversify_1.injectable)()
], MpesaTillRepository);
