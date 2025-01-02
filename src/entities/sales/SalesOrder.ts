
export class SalesOrder {
    constructor(
        public readonly order_items: Items[],
        public readonly waitstaff_id: number,
    ) { }
}

type Items = {

    "menu_item_id": number,
    "quantity": number

}