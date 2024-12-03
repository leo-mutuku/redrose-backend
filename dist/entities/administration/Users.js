"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(user_id, ttl, username, first_name, last_name, password, phone, is_active, roles) {
        this.user_id = user_id;
        this.ttl = ttl;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.password = password;
        this.phone = phone;
        this.is_active = is_active;
        this.roles = roles;
    }
}
exports.User = User;
