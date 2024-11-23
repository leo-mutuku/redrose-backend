import { inject, injectable } from "inversify";
import { IStaffInteractor } from "../../interfaces/administation/IStaffInteractor";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";

@injectable()
export class StaffInteractor implements IStaffInteractor {
    private repository: IStaffRepository;
    constructor(@inject(INTERFACE_TYPE.StaffRepository) repository: IStaffRepository) {
        this.repository = repository;

    }
    async createStaff(input: any): Promise<any> {
        try {
            const staff = await this.repository.createStaff(input);
            return staff;

        } catch (error) {
            throw new AppError("Failed to create staff" + error, 500);

        }

    }
    getStaff(id: number): Promise<any> {
        try {
            const staff = this.repository.getStaff(id);
            return staff;

        } catch (error) {

            throw new AppError("Failed to get staff" + error, 500);
        }
    }
    updateStaff(id: number, input: any): Promise<any> {
        try {
            const staff = this.repository.updateStaff(id, input);
            return staff;

        } catch (error) {
            throw new AppError("Failed to update staff" + error, 500);

        }
    }
    getStaffs(limit: number, offset: number): Promise<any> {
        try {
            const staffs = this.repository.getStaffs(limit, offset);
            return staffs;

        } catch (error) {

            throw new AppError("Failed to get staffs" + error, 500);
        }
    }
}