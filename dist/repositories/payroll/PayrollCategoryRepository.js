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
exports.PayrollCategoryRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let PayrollCategoryRepository = class PayrollCategoryRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new payroll category
    createPayrollCategory(_a) {
        return __awaiter(this, arguments, void 0, function* ({}) {
            try {
                const query = `
                INSERT INTO payroll_category (category_name, category_description, is_active)
                VALUES ($1, $2, $3)
                RETURNING payroll_category_id, category_name, category_description, is_active
            `;
                const values = [];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating payroll category: ' + error, 500);
            }
        });
    }
    // Get a list of payroll categories with pagination
    getPayrollCategories(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payroll_category_id, category_name, category_description, is_active
                FROM payroll_category
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payroll categories: ' + error, 500);
            }
        });
    }
    // Get a single payroll category by ID
    getPayrollCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payroll_category_id, category_name, category_description, is_active
                FROM payroll_category
                WHERE payroll_category_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll category not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payroll category: ' + error, 500);
            }
        });
    }
    // Update an existing payroll category
    updatePayrollCategory(id, payrollCategory) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE payroll_category SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(payrollCategory).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE payroll_category_id = $${values.length + 1} RETURNING 
                payroll_category_id, category_name, category_description, is_active`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll category not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating payroll category: ' + error, 500);
            }
        });
    }
    // Delete a payroll category by ID
    deletePayrollCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM payroll_category
                WHERE payroll_category_id = $1
                RETURNING payroll_category_id, category_name, category_description, is_active
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll category not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting payroll category: ' + error, 500);
            }
        });
    }
};
exports.PayrollCategoryRepository = PayrollCategoryRepository;
exports.PayrollCategoryRepository = PayrollCategoryRepository = __decorate([
    (0, inversify_1.injectable)()
], PayrollCategoryRepository);
