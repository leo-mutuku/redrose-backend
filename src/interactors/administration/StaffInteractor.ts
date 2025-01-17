import { inject, injectable } from "inversify";
import { IStaffInteractor } from "../../interfaces/administation/IStaffInteractor";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { SMSService } from "../../external-libraries/SMSService";

@injectable()
export class StaffInteractor implements IStaffInteractor {
    private repository: IStaffRepository;
    constructor(@inject(INTERFACE_TYPE.StaffRepository) repository: IStaffRepository) {
        this.repository = repository;

    }
    async createStaff(input: any): Promise<any> {
        try {
            const staff = await this.repository.createStaff(input);
            if (!staff) {
                throw new AppError("Failed to create staff", 500);
            }
            const smsService = new SMSService();
            const message = `Hello ${staff.first_name} ${staff.last_name}, your staff account has been created successfully. Your staff ID is ${staff.staff_id}. Please note this is system generated SMS and should not be shared with anyone. Thank you, REDROSE.`;
            await smsService.sendSingle(staff.phone, message);
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