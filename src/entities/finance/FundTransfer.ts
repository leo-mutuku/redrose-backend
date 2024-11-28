export class FundTransfer {
    constructor(
        public readonly src_account_name: string,
        public readonly des_account_name: string,
        public readonly src_account_balance: number,
        public readonly des_account_balance: number,
        public readonly amount: number,
        public readonly created_by?: number,
        public readonly fund_transfer_id?: number,
        public readonly created_at?: Date,

    ) { }
}