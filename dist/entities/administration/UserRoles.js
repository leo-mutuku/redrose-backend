"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
class UserRole {
    constructor(user_id, role_id, user_role_id, roles, created_by) {
        this.user_id = user_id;
        this.role_id = role_id;
        this.user_role_id = user_role_id;
        this.roles = roles;
        this.created_by = created_by;
    }
}
exports.UserRole = UserRole;
