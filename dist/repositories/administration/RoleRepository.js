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
exports.RoleRepository = void 0;
const dbConnection_1 = require("../../dbConnection");
const inversify_1 = require("inversify");
const AppError_1 = require("../../utils/AppError");
let RoleRepository = class RoleRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    createRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `INSERT INTO roles(role_name,role_description, created_by)
                 VALUES($1, $2, $3)
              RETURNING *`;
                const values = [role.role_name, role.role_description, role.created_by];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while cteating role: " + error, 400);
            }
        });
    }
    getRole(role_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM roles WHERE role_id = $1`;
                const values = [role_id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting role: " + error, 400);
            }
        });
    }
    getRoles(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `SELECT * FROM roles LIMIT $1 OFFSET $2`;
                const values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows;
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting roles: " + error, 400);
            }
        });
    }
    updateRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the existing record
                const existingQuery = `SELECT role_name, role_description FROM roles WHERE role_id = $1`;
                const existingResult = yield this.client.query(existingQuery, [id]);
                if (existingResult.rows.length === 0) {
                    throw new Error(`Role with ID ${id} not found`);
                }
                const existingRole = existingResult.rows[0];
                // Check if any changes are detected
                const isNameChanged = existingRole.role_name !== role.role_name;
                const isDescriptionChanged = existingRole.role_description !== role.role_description;
                if (!isNameChanged && !isDescriptionChanged) {
                    throw new AppError_1.AppError("No changes detected, update skipped.", 400);
                }
                // Update only the fields that changed
                const updateQuery = `
                UPDATE roles SET 
                    role_name = COALESCE($1, role_name),
                    role_description = COALESCE($2, role_description)
                WHERE role_id = $3
                RETURNING *`;
                const values = [
                    isNameChanged ? role.role_name : null, // Update if changed, else retain existing
                    isDescriptionChanged ? role.role_description : null,
                    id
                ];
                const updateResult = yield this.client.query(updateQuery, values);
                return updateResult.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while updating role: " + error, 400);
            }
        });
    }
};
exports.RoleRepository = RoleRepository;
exports.RoleRepository = RoleRepository = __decorate([
    (0, inversify_1.injectable)()
], RoleRepository);
