export interface IStaffInteractor {
    createStaff(input: any): Promise<any>;
    getStaff(id: number): Promise<any>;
    updateStaff(id: number, input: any): Promise<any>;
    getStaffs(limit: number, offset: number): Promise<any>;
}