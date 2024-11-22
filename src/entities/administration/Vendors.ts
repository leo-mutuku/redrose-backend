export class Vendor {
    constructor(
        public readonly vendor_name: string,
        public readonly phone: string,
        public readonly balance: number,
        public readonly vendor_id?: number,
        public readonly is_active?: boolean,
        public readonly created_by?: number,
        public readonly created_at?: Date,
    ) { }
}