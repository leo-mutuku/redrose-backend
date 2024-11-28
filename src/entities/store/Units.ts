export class Units {
    constructor(
        public readonly unit_id: number,
        public readonly standard_unit_name: string,
        public readonly standard_unit_value: number,
        public readonly other_unit_name: string,
        public readonly other_unit_value: number,


    ) { }
}