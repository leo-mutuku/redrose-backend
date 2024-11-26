import { Shift } from "../../entities/administration/Shift"
export interface IShiftRepository {
    createShift(shift: Shift): Promise<Shift>
    getShift(id: number): Promise<Shift>
    getShifts(limit: number, offset: number): Promise<Shift[]>
    updateShift(id: number, shift: Shift): Promise<Shift>
}