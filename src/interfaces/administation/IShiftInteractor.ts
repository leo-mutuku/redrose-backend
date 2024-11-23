import { Shift } from "../../entities/administration/Shift"
export interface IShiftInteractor {
    createShift(shift: Shift);
    getShift(id: number);
    getShifts(limit: number, offset: number);
    updateShift(id: number, shift: Shift);
}