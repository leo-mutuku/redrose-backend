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
                INSERT INTO mpesa_till (till_number, mpesa_till_name, balance)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
                const values = [
                    input.till_number,
                    input.mpesa_till_name,
                    input.balance,
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
                SELECT * FROM mpesa_till WHERE mpesa_till_id = $1;
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
                // First, fetch the current Mpesa till details
                const currentTillQuery = `
                SELECT * FROM mpesa_till WHERE mpesa_till_id = $1;
            `;
                const currentTillResult = yield this.client.query(currentTillQuery, [tillNumber]);
                if (currentTillResult.rows.length === 0) {
                    throw new AppError_1.AppError(`Mpesa till with number ${tillNumber} not found`, 404);
                }
                const currentTill = currentTillResult.rows[0];
                // Track which fields have changed
                const updatedFields = [];
                const values = [];
                // Dynamically track placeholder indices
                if (input.mpesa_till_name && input.mpesa_till_name !== currentTill.mpesa_till_name) {
                    updatedFields.push(`mpesa_till_name = $${values.length + 1}`);
                    values.push(input.mpesa_till_name);
                }
                if (input.balance !== undefined && input.balance !== currentTill.balance) {
                    updatedFields.push(`balance = $${values.length + 1}`);
                    values.push(input.balance);
                }
                if (input.till_number !== undefined && input.till_number !== currentTill.till_number) {
                    updatedFields.push(`till_number = $${values.length + 1}`);
                    values.push(input.till_number);
                }
                // If no fields have changed, throw an error
                if (updatedFields.length === 0) {
                    throw new AppError_1.AppError("No changes detected to update Mpesa till.", 400);
                }
                // Proceed with updating the Mpesa till
                const query = `
                UPDATE mpesa_till
                SET ${updatedFields.join(", ")}
                WHERE mpesa_till_id = $${values.length + 1}
                RETURNING *;
            `;
                // Add the tillNumber to the values array
                values.push(tillNumber);
                const result = yield this.client.query(query, values);
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
                SELECT * FROM mpesa_till
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
