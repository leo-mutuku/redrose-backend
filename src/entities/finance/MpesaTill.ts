export class MpesaTill {
    constructor(
        public readonly mpesa_till_name: string,
        public readonly balance: number,
        public readonly created_by?: number,
        public readonly mpesa_till_id?: number,
        public readonly created_at?: Date,

    ) { }
}