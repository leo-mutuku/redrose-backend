"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrder = void 0;
class SalesOrder {
    constructor(sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at) {
        this.sales_order_id = sales_order_id;
        this.customer_id = customer_id;
        this.order_date = order_date;
        this.total_amount = total_amount;
        this.status = status;
        this.created_by = created_by;
        this.created_at = created_at;
    }
}
exports.SalesOrder = SalesOrder;
