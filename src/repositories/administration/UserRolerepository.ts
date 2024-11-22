import { Shift } from "../../entities/administration/Shift";
import { IShiftRepository } from "../../interfaces/administation/IShiftRepository";


export class ShiftRepository implements IShiftRepository {
    createRole(shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    getRole(username: string): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    getRoles(shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    updateRole(id: number, shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }

}   