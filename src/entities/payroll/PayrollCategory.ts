export class PayrollCategory {
    constructor(
        public id: number,
        public name: string,
        public amount: number,
        public type: string,
        public created_at: string,
        public updated_at: string,
    ) { }
}