"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundTransfer = void 0;
class FundTransfer {
    constructor(src_account_name, des_account_name, src_account_balance, des_account_balance, amount, created_by, fund_transfer_id, created_at) {
        this.src_account_name = src_account_name;
        this.des_account_name = des_account_name;
        this.src_account_balance = src_account_balance;
        this.des_account_balance = des_account_balance;
        this.amount = amount;
        this.created_by = created_by;
        this.fund_transfer_id = fund_transfer_id;
        this.created_at = created_at;
    }
}
exports.FundTransfer = FundTransfer;
