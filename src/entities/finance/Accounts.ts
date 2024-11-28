export class Account {
    constructor(
        public readonly account_name: string,
        public readonly balance: number,
        public readonly created_by?: number,
        public readonly account_id?: number,
        public readonly created_at?: Date,

    ) { }
}