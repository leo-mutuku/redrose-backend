
export class SalesOrder {
    constructor(
        public readonly order_items: Items[],
        public readonly staff_id: number,
        public readonly status?: string,
    ) { }
}

type Items = {
    menu_item_id: number,
    quantity: number
}