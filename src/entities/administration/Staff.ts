export class Staff {
    constructor(
        public readonly staff_id: number,
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly created_by: number,
        public readonly email?: string,
        public readonly payroll_category?: number,
        public readonly is_active?: boolean
    ) { }
}

