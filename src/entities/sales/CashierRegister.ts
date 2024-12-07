
export class CashierRegister {
    constructor(
        public readonly staff_id: number,
        public readonly balance: number,
        public readonly pin: number,
        public readonly created_by: number

    ) {

    }
}