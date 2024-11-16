export class Supplier {
    constructor(
        public readonly supplier_id: number,
        public readonly supplier_name: string,
        public readonly supplier_code: number,
        public readonly description: string
    ) { }
}