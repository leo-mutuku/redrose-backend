export class PurchaseOrder {
    constructor(
        public readonly purchase_date: Date,
        public readonly total: number,
        public readonly from: string,
        public readonly from_id: number,
        public readonly cash: Boolean,
        public readonly cash_details: CashDetail[],
        public readonly order_details: OrderDetail[]


    ) { }
}

type CashDetail = {
    store_item_id: number,
    quantity: number,
    total_price: number,
    vat_type: string

}
type OrderDetail = {
    store_item_id: number,
    "quantity": number,
    "total_price": number,
    "vat_type": string

}
