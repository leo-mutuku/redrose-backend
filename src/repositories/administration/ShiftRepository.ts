import { Shift } from "../../entities/administration/Shift";
import { IShiftRepository } from "../../interfaces/administation/IShiftRepository";


export class ShiftRepository implements IShiftRepository {
    async createRole(shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    async getRole(username: string): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    async getRoles(shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
    async updateRole(id: number, shift: Shift): Promise<Shift> {
        throw new Error("Method not implemented.");
    }
}