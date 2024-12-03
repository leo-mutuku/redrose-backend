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
exports.VendorRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let VendorRepository = class VendorRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createVendor(vendor) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO vendors(vendor_name,phone, created_by) 
            VALUES($1,$2, $3) RETURNING *`;
                const values = [vendor.vendor_name, vendor.phone, vendor.created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while creating vendor: " + error, 400);
            }
        });
    }
    updateVendor(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch the existing vendor details from the database
                const existingQuery = 'SELECT * FROM vendors WHERE vendor_id = $1';
                const existingResult = yield this.client.query(existingQuery, [id]);
                if (existingResult.rows.length === 0) {
                    throw new AppError_1.AppError('Vendor not found', 404);
                }
                const existingData = existingResult.rows[0];
                // Step 2: Compare input values with existing values
                const updates = [];
                const values = [];
                let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)
                for (const key in input) {
                    if (Object.prototype.hasOwnProperty.call(input, key)) {
                        const value = input[key];
                        // Check if the value is different from the existing value
                        if (value !== undefined && value !== existingData[key]) {
                            updates.push(`${key} = $${index}`);
                            values.push(value);
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
                UPDATE vendors
                SET ${updates.join(', ')}
                WHERE vendor_id = $${index}
                RETURNING *;
            `;
                values.push(id); // Add the vendor_id as the last parameter
                const result = yield this.client.query(updateQuery, values);
                // Step 5: Return the updated record
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while updating vendor: " + error, 400);
            }
        });
    }
    getVendor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM vendors WHERE vendor_id = $1`;
                const values = [id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting vendor: " + error, 400);
            }
        });
    }
    getVendors(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM vendors LIMIT $1 OFFSET $2`;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting vendors: " + error, 400);
            }
        });
    }
};
exports.VendorRepository = VendorRepository;
exports.VendorRepository = VendorRepository = __decorate([
    (0, inversify_1.injectable)()
], VendorRepository);
