import { Staff } from "../../entities/administration/Staff"
export interface IStaffRepository {
    createStaff(staff: Staff): Promise<Staff>
    getStaff(username: string): Promise<Staff>
    getStaffs(staff: Staff): Promise<Staff>
    updateStaff(id: number, staff: Staff): Promise<Staff>
}