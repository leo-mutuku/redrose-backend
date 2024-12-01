export class ItemRegister {
    constructor(
        public readonly item_id: number,
        public readonly item_name: string,
        public readonly item_description: string,
        public readonly created_by: number,
        public readonly created_at: Date,
        public readonly created_by_name: string,
    ) { }
}