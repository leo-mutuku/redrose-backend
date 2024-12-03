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
exports.StaffRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let StaffRepository = class StaffRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createStaff(_a) {
        return __awaiter(this, arguments, void 0, function* ({ first_name, last_name, phone, created_by }) {
            try {
                const query = `INSERT INTO staff (first_name, last_name, phone, created_by)
            VALUES ($1, $2,$3,$4) RETURNING 
            staff_id, first_name, last_name, phone, created_by`;
                const value = [first_name, last_name, phone, created_by];
                let result = yield this.client.query(query, value);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error creating staff' + error, 400);
            }
        });
    }
    getStaff(staff_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM staff WHERE staff_id = $1`;
                const value = [staff_id];
                let result = yield this.client.query(query, value);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error getting staff' + error, 400);
            }
        });
    }
    getStaffs(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM staff WHERE is_active = true LIMIT $1 OFFSET $2`;
                const value = [limit, offset];
                let result = yield this.client.query(query, value);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError('Error getting staff' + error, 400);
            }
        });
    }
    updateStaff(id, staff) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Fetch the existing staff details from the database
                const existingQuery = 'SELECT * FROM staff WHERE staff_id = $1';
                const existingResult = yield this.client.query(existingQuery, [id]);
                if (existingResult.rows.length === 0) {
                    throw new AppError_1.AppError('Staff member not found', 404);
                }
                const existingData = existingResult.rows[0];
                // Step 2: Dynamically construct the update query
                const updates = [];
                const values = [];
                let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)
                for (const key in staff) {
                    if (Object.prototype.hasOwnProperty.call(staff, key)) {
                        const value = staff[key];
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
                UPDATE staff
                SET ${updates.join(', ')}
                WHERE staff_id = $${index}
                RETURNING *;
            `;
                values.push(id); // Add the staff_id as the last parameter
                const result = yield this.client.query(updateQuery, values);
                // Step 5: Return the updated record
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError('Error updating staff' + error, 400);
            }
        });
    }
};
exports.StaffRepository = StaffRepository;
exports.StaffRepository = StaffRepository = __decorate([
    (0, inversify_1.injectable)()
], StaffRepository);
