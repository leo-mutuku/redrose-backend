export class SalesOrderClearing {
    constructor(
        public sales_order_clearing_id: number,
        public sales_order_id: number,
        public cleared_by: string,
        public cleared_date: Date,
        public clearing_amount: number,
        public created_at: Date
    ) { }
}