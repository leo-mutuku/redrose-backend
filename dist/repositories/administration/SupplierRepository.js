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
exports.SupplierRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let SupplierRepository = class SupplierRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createSupplier(supplier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO suppliers(supplier_name,phone, created_by) VALUES($1, $2, $3)
              RETURNING *`;
                const values = [supplier.supplier_name, supplier.phone, supplier.created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while creating supplier: " + error, 400);
            }
        });
    }
    getSuppliers(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM suppliers LIMIT $1 OFFSET $2`;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting suppliers: " + error, 400);
            }
        });
    }
    getSupplier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM suppliers WHERE supplier_id = $1`;
                const values = [id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting supplier: " + error, 400);
            }
        });
    }
    updateSupplier(id, supplier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch the existing supplier details from the database
                const existingQuery = `SELECT * FROM suppliers WHERE supplier_id = $1`;
                const existingResult = yield this.client.query(existingQuery, [id]);
                if (existingResult.rows.length === 0) {
                    throw new AppError_1.AppError('Supplier not found', 404);
                }
                const existingData = existingResult.rows[0];
                // Step 2: Dynamically construct the UPDATE query
                const updates = [];
                const values = [];
                let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)
                for (const key in supplier) {
                    if (Object.prototype.hasOwnProperty.call(supplier, key)) {
                        const newValue = supplier[key];
                        if (newValue !== undefined && newValue !== existingData[key]) {
                            updates.push(`${key} = $${index}`);
                            values.push(newValue);
                            index++;
                        }
                    }
                }
                // Step 3: If no fields have changed, throw an error
                if (updates.length === 0) {
                    throw new AppError_1.AppError('No fields were changed', 400);
                }
                // Step 4: Construct and execute the UPDATE query
                const updateQuery = `
                UPDATE suppliers
                SET ${updates.join(', ')}
                WHERE supplier_id = $${index}
                RETURNING *;
            `;
                values.push(id); // Add the supplier_id as the last parameter
                const result = yield this.client.query(updateQuery, values);
                // Step 5: Return the updated record
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while updating supplier: " + error, 400);
            }
        });
    }
};
exports.SupplierRepository = SupplierRepository;
exports.SupplierRepository = SupplierRepository = __decorate([
    (0, inversify_1.injectable)()
], SupplierRepository);
