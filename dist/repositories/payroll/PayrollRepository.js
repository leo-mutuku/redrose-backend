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
exports.PayrollRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let PayrollRepository = class PayrollRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    // Create a new payroll record
    createPayroll(_a) {
        return __awaiter(this, arguments, void 0, function* ({ employee_id, payroll_date, gross_salary, deductions, net_salary, status }) {
            try {
                const query = `
                INSERT INTO payroll (employee_id, payroll_date, gross_salary, deductions, net_salary, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
            `;
                const values = [employee_id, payroll_date, gross_salary, deductions, net_salary, status];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating payroll record: ' + error, 500);
            }
        });
    }
    // Get a list of payroll records with pagination
    getPayrolls(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
                FROM payroll
                LIMIT $1 OFFSET $2
            `;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payroll records: ' + error, 500);
            }
        });
    }
    // Get a single payroll record by ID
    getPayroll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                SELECT payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
                FROM payroll
                WHERE payroll_id = $1
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll record not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error fetching payroll record: ' + error, 500);
            }
        });
    }
    // Update an existing payroll record
    updatePayroll(id, payroll) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE payroll SET `;
                const values = [];
                let setClauses = [];
                // Dynamically build the SET clause and values array
                Object.entries(payroll).forEach(([key, value], index) => {
                    setClauses.push(`${key} = $${index + 1}`);
                    values.push(value);
                });
                if (setClauses.length === 0) {
                    throw new AppError_1.AppError('No fields to update', 400);
                }
                query += setClauses.join(', ');
                query += ` WHERE payroll_id = $${values.length + 1} RETURNING 
                payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status`;
                values.push(id);
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll record not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating payroll record: ' + error, 500);
            }
        });
    }
    // Delete a payroll record by ID
    deletePayroll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `
                DELETE FROM payroll
                WHERE payroll_id = $1
                RETURNING payroll_id, employee_id, payroll_date, gross_salary, deductions, net_salary, status
            `;
                const values = [id];
                const result = yield this.client.query(query, values);
                if (result.rows.length === 0) {
                    throw new AppError_1.AppError('Payroll record not found', 404);
                }
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error deleting payroll record: ' + error, 500);
            }
        });
    }
};
exports.PayrollRepository = PayrollRepository;
exports.PayrollRepository = PayrollRepository = __decorate([
    (0, inversify_1.injectable)()
], PayrollRepository);
