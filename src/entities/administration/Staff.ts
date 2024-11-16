export class Staff {
    constructor(
        public readonly staff_id: number,
        public readonly fist_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly email?: string
    ) { }
}