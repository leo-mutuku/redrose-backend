export interface IStaffInteractor {
    createStaff(input: any);
    getStaff(id: number)
    getStaffs(limit: number, offset: number);
    updateStaff(id: number, input: any);
}