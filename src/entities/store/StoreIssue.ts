
type IssueList = {
    store_item_id: number;
    issue_quantity: number;
    initial_value?: number; // backend
    final_value?: number;   //backend
    store_issue_header_id?: number; //backend
};

export class StoreIssue {
    constructor(
        public readonly issue_date: Date,
        public readonly description: string,
        public readonly issued_by: number,  // staff_id
        public readonly created_by: number,
        public readonly issue_type: "KITCHEN" | "RESTAURANT",
        public readonly status: "New" | "In-Progress" | "Posted",
        public readonly issue_list: IssueList[],
        public readonly created_at?: Date,

    ) { }
}