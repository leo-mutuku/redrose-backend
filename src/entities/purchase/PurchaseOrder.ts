export class PurchaseOrder {
    constructor(
        public readonly purchase_date: Date,
        public readonly total: number,
        public readonly from_: "VENDOR" | "SUPPLIER",
        public readonly from_id: number,
        public readonly pay_mode: "CASH" | "CREDIT",
        public readonly account_type: "CASH" | "BANK",
        public readonly order_details: OrderDetail[],
        public readonly total_vat: number,
        public readonly shift_id: number,
        public readonly created_by: number,
        public readonly bank_id?: number | 0,
        public readonly cash_account_id?: number | 0,
        public readonly staff_id?: number | 0,

    ) { }
}
type OrderDetail = {
    store_item_id: number,
    buying_price: number,
    quantity: number,
    total_price: number,
    vat_type: string,
    vat: number
}
