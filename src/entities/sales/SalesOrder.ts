
export class SalesOrder {
    constructor(
        public readonly order_items: Items[],
        public readonly waitstaff_id: number,
        public readonly secure_staff_id: number,
        public readonly pin?: number,
        public readonly status?: string,
        public readonly staff_id?: number
    ) { }
}

type Items = {

    "menu_item_id": number,
    "quantity": number

}