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
exports.DeductionRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let DeductionRepository = class DeductionRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new deduction
    createDeduction(_a) {
        return __awaiter(this, arguments, void 0, function* ({ deduction_type, amount, description, deduction_date }) {
            try {
                const query = `
                INSERT INTO deduction (deduction_type, amount, description, deduction_date)
                VALUES ($1, $2, $3, $4)
                RETURNING deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
            `;
                const values = [deduction_type, amount, description, deduction_date];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating deduction: ' + error, 500);
            }
        });
    }
    // Get a list of deductions with pagination
    getDeductions(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
                FROM deduction
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching deductions: ' + error, 500);
            }
        });
    }
    // Get a single deduction by ID
    getDeduction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
                FROM deduction
                WHERE deduction_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Deduction not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching deduction: ' + error, 500);
            }
        });
    }
    // Update an existing deduction
    updateDeduction(id, deduction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE deduction SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(deduction).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE deduction_id = $${values.length + 1} RETURNING 
                deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Deduction not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating deduction: ' + error, 500);
            }
        });
    }
    // Delete a deduction by ID
    deleteDeduction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM deduction
                WHERE deduction_id = $1
                RETURNING deduction_id, deduction_type, amount, description,
                TO_CHAR(deduction_date, 'DD/MM/YYYY') AS deduction_date
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Deduction not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting deduction: ' + error, 500);
            }
        });
    }
};
exports.DeductionRepository = DeductionRepository;
exports.DeductionRepository = DeductionRepository = __decorate([
    (0, inversify_1.injectable)()
], DeductionRepository);
