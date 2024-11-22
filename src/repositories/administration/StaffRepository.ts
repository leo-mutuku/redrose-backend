import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { Staff } from "../../entities/administration/Staff";

export class StaffRepository implements IStaffRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }

    createStaff({ first_name, last_name, phone, created_by }: Staff): Promise<Staff> {
        try {
            const query = `INSERT INTO staff (first_name, last_name, phone, created_by)
            VALUES ($1, $2,$3,$4) RETURNING *`
            const value = [first_name, last_name, phone, created_by]



        } catch (error) {

        }
    }
    getStaff(username: string): Promise<Staff> {
        throw new Error("Method not implemented.");
    }
    getStaffs(staff: Staff): Promise<Staff> {
        throw new Error("Method not implemented.");
    }
    updateStaff(id: number, staff: Staff): Promise<Staff> {
        throw new Error("Method not implemented.");
    }

}