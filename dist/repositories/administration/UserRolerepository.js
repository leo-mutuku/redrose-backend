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
exports.UserRoleRepository = void 0;
const inversify_1 = require("inversify");
const dbConnection_1 = require("../../dbConnection");
const AppError_1 = require("../../utils/AppError");
let UserRoleRepository = class UserRoleRepository {
    constructor() {
        this.client = (0, dbConnection_1.pgClient)();
    }
    assignUserRoles(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.client.query(`SELECT role_id FROM user_roles WHERE user_id = $1`, [id]);
                const role_ids = user.rows.map((role) => role.role_id);
                const new_ids = roles === null || roles === void 0 ? void 0 : roles.filter((role) => !role_ids.includes(role));
                if (!(new_ids === null || new_ids === void 0 ? void 0 : new_ids.length)) {
                    console.log("User already has these roles");
                    throw new AppError_1.AppError("User already has these roles", 400);
                }
                for (let role of new_ids) {
                    const query = `INSERT INTO user_roles(role_id, user_id) VALUES($1, $2) RETURNING *`;
                    const values = [role, id];
                    yield this.client.query(query, values);
                }
                // Combine existing and new role IDs
                return { roles: [...role_ids, ...new_ids] };
            }
            catch (error) {
                throw new AppError_1.AppError("Error while creating user role: " + error, 400);
            }
        });
    }
    updateUserRole(id, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `UPDATE user_roles SET role_id = $1, user_id = $2 WHERE user_role_id = $3
              RETURNING *`;
                const values = [userRole.role_id, userRole.user_id, id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while updating shift: " + error, 400);
            }
        });
    }
    getUserRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT * FROM user_roles WHERE user_role_id = $1`;
                let values = [id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting shift: " + error, 400);
            }
        });
    }
    unassignRoles(id, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.client.query(`SELECT role_id FROM user_roles WHERE user_id = $1`, [id]);
                const role_ids = user.rows.map((role) => role.role_id);
                console.log(role_ids, "role ids");
                const new_ids = roles === null || roles === void 0 ? void 0 : roles.filter((role) => role_ids.includes(role));
                console.log(new_ids, "new ids");
                if (!(new_ids === null || new_ids === void 0 ? void 0 : new_ids.length)) {
                    console.log("");
                    throw new AppError_1.AppError("User is not current assigned of of the roles(s)", 400);
                }
                for (let role of new_ids) {
                    const query = `Delete FROM user_roles WHERE role_id = $1 AND user_id = $2 RETURNING *`;
                    const values = [role, id];
                    yield this.client.query(query, values);
                }
                // Combine existing and new role IDs
                return { roles: [new_ids] };
            }
            catch (error) {
                throw new AppError_1.AppError("Error while unassiging user role: " + error, 400);
            }
        });
    }
    getRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT * FROM shifts WHERE shift_id = $1`;
                let values = [id];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting shift: " + error, 400);
            }
        });
    }
    getRoles(limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `SELECT * FROM shifts LIMIT $1 OFFSET $2`;
                let values = [limit, offset];
                const result = yield this.client.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new AppError_1.AppError("Error while getting shift: " + error, 400);
            }
        });
    }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    (0, inversify_1.injectable)()
], UserRoleRepository);
