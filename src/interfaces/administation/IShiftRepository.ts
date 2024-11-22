import { Shift } from "../../entities/administration/Shift"
export interface IShiftRepository {
    createRole(shift: Shift): Promise<Shift>
    getRole(username: string): Promise<Shift>
    getRoles(shift: Shift): Promise<Shift>
    updateRole(id: number, shift: Shift): Promise<Shift>
}