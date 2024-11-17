"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
class Users {
    constructor(user_id, username, password, ttl, phone) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.ttl = ttl;
        this.phone = phone;
    }
}
exports.Users = Users;
