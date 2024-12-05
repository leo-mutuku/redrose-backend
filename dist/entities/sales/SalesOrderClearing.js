"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderClearing = void 0;
class SalesOrderClearing {
    constructor(sales_order_clearing_id, sales_order_id, cleared_by, cleared_date, clearing_amount, created_at) {
        this.sales_order_clearing_id = sales_order_clearing_id;
        this.sales_order_id = sales_order_id;
        this.cleared_by = cleared_by;
        this.cleared_date = cleared_date;
        this.clearing_amount = clearing_amount;
        this.created_at = created_at;
    }
}
exports.SalesOrderClearing = SalesOrderClearing;
