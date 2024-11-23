import { Staff } from "../../entities/administration/Staff"
export interface IStaffRepository {
    createStaff(staff: Staff): Promise<Staff>
    getStaff(staff_id: number): Promise<Staff>
    getStaffs(limit: number, offset: number): Promise<Staff[]>
    updateStaff(id: number, staff: Staff): Promise<Staff>
}