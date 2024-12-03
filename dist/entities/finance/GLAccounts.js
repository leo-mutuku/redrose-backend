"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLAccount = void 0;
class GLAccount {
    constructor(gl_account_name, balance, created_by, gl_account_id, created_at) {
        this.gl_account_name = gl_account_name;
        this.balance = balance;
        this.created_by = created_by;
        this.gl_account_id = gl_account_id;
        this.created_at = created_at;
    }
}
exports.GLAccount = GLAccount;
