export class Shift {
    constructor(
        public readonly shift_start: Date,
        public readonly shift_end: Date,
        public readonly shift_id?: number,
        public readonly created_by?: number,
    ) { }
}
