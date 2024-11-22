import { Shift } from "../../entities/administration/Shift"
export interface IShiftInteractor {
    createRole(shift: Shift);
    getRole(username: string);
    getRoles(shift: Shift);
    updateRole(id: number, shift: Shift);
}