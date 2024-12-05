
export class SalesOrder {
    constructor(
        public sales_order_id: number,
        public customer_id: number,
        public order_date: Date,
        public total_amount: number,
        public status: string,
        public created_by: string,
        public created_at: Date
    ) { }
}