"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashAccount = void 0;
class CashAccount {
    constructor(cash_account_name, balance, created_by, cash_account_id, created_at) {
        this.cash_account_name = cash_account_name;
        this.balance = balance;
        this.created_by = created_by;
        this.cash_account_id = cash_account_id;
        this.created_at = created_at;
    }
}
exports.CashAccount = CashAccount;
