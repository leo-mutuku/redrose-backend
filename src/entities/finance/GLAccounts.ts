export class GLAccount {
    constructor(
        public readonly gl_account_name: string,
        public readonly balance: number,
        public readonly created_by?: number,
        public readonly gl_account_id?: number,
        public readonly created_at?: Date,

    ) { }
}