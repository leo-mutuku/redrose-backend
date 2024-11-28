export class ItemTracking {
    constructor(
        public readonly item_tracking_id: number,
        public readonly item_id: number,
        public readonly initial_balance: string,
        public readonly current_balance: number,
        public readonly net_change: number,
        public readonly reason: string,
        public readonly action_by: string,
    ) { }
}