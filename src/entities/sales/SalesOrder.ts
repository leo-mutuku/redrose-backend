
export class SalesOrder {
    constructor(
        public readonly order_items: Items[],

    ) { }
}

type Items = {

    "menu_item_id": number,
    "quantity": number

}