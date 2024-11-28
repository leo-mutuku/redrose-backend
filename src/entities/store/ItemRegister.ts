export class ItemRegister {
    constructor(
        public readonly item_id: number,
        public readonly item_code: string,
        public readonly item_unit_id: number,
        public readonly buying_price: number,
        public readonly selling_price: number,
    ) { }
}