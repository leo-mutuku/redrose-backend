export class Supplier {
    constructor(

        public readonly supplier_name: string,
        public readonly phone: string,
        public readonly balance: number,
        public readonly supplier_id?: number,
        public readonly is_active?: boolean,
        public readonly created_by?: number,
        public readonly created_at?: Date,
    ) { }
}