
export class WaitStaffRegister {
    constructor(
        public waitStaffRegisterId: number,
        public staffId: number,
        public registerTime: Date,
        public tableAssigned: number,
        public createdBy: number,
        public createdAt: Date
    ) { }
}