"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
class Account {
    constructor(account_name, balance, created_by, account_id, created_at) {
        this.account_name = account_name;
        this.balance = balance;
        this.created_by = created_by;
        this.account_id = account_id;
        this.created_at = created_at;
    }
}
exports.Account = Account;
