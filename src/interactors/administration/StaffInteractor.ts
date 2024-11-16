import { IStaffInteractor } from "../../interfaces/administation/IStaffInteractor";

export class StaffInteractor implements IStaffInteractor {
    createStaff(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getStaff(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateStaff(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getStaffs(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}