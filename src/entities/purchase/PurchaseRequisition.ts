export class PurchaseRequisition {

    constructor(
        public readonly purchase_date: Date,
        public readonly total: number,
        public readonly account_type: "CASH" | "BANK",
        public readonly order_details: OrderDetail[],
        public readonly bank_id?: number | 0,
        public readonly cash_account_id?: number | 0,
    ) { }
}
type OrderDetail = {
    store_item_id: number,
    bying_price: number,
    quantity: number,
    total_price: number,
    vat_type: string,
    vat: number
}