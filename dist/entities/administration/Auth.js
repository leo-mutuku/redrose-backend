"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
class Auth {
    constructor(username, password, user_id, token, roles) {
        this.username = username;
        this.password = password;
        this.user_id = user_id;
        this.token = token;
        this.roles = roles;
    }
}
exports.Auth = Auth;
