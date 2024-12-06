"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrder = void 0;
class PurchaseOrder {
    constructor(purchase_date, total, from, from_id, cash, cash_details, order_details) {
        this.purchase_date = purchase_date;
        this.total = total;
        this.from = from;
        this.from_id = from_id;
        this.cash = cash;
        this.cash_details = cash_details;
        this.order_details = order_details;
    }
}
exports.PurchaseOrder = PurchaseOrder;
