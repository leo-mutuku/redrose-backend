export class StoreItem {
    constructor(
        public readonly store_item_id: number,
        public readonly store_id: number,
        public readonly store_name: string,
        public readonly item_id: number,
        public readonly item_name: string,
        public readonly unit_id: number,
        public readonly unit_name_std: string,
        public readonly unit_name_value_std: number,
        public readonly unit_name_other: string,
        public readonly unit_name_value_other: number,
        public readonly quantity: number,
        public readonly selling_price: number,
        public readonly buying_price: number,
        public readonly item_unit: number,
        public readonly item_status: number,
        public readonly item_category: number,
    ) { }
}