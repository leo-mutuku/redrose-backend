export class ItemCategory {
    constructor(
        public readonly category_id: number,
        public readonly category_name: string,
        public readonly category_description: string,
        public readonly created_at?: Date,



    ) { }
}