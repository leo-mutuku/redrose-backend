export class CashAccount {
    constructor(
        public readonly cash_account_name: string,
        public readonly balance: number,
        public readonly created_by?: number,
        public readonly cash_account_id?: number,
        public readonly created_at?: Date,

    ) { }
}