export class Bank {
    constructor(
        public readonly bank_name: string,
        public readonly bank_number: string,
        public readonly balance: number,
        public readonly created_by?: number,
        public readonly bank_id?: number,
        public readonly created_at?: Date,

    ) { }
}