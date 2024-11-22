import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { Staff } from "../../entities/administration/Staff";

@injectable()
export class StaffRepository implements IStaffRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }

    async createStaff({ first_name, last_name, phone, created_by }: Staff): Promise<Staff> {
        try {
            const query = `INSERT INTO staff (first_name, last_name, phone, created_by)
            VALUES ($1, $2,$3,$4) RETURNING *`
            const value = [first_name, last_name, phone, created_by]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {
            throw new AppError('Error creating staff' + error, 400)


        }
    }
    async getStaff(staff_id: number): Promise<Staff> {
        try {
            const query = `SELECT * FROM staff WHERE username = $1`
            const value = [staff_id]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {
            throw new AppError('Error getting staff' + error, 400)

        }
    }
    async getStaffs(limit: number, offset: number): Promise<Staff> {
        try {
            const query = `SELECT * FROM staff WHERE is_active = true LIMIT $1 OFFSET $2`
            const value = [limit, offset]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {
            throw new AppError('Error getting staff' + error, 400)

        }
    }
    async updateStaff(id: number, staff: Staff): Promise<Staff> {
        try {
            const query = `UPDATE staff SET first_name = $1, last_name = $2, phone = $3, is_active = $4 WHERE staff_id = $5 RETURNING *`
            const value = [staff.first_name, staff.last_name, staff.phone, staff.is_active, id]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {
            throw new AppError('Error updating staff' + error, 400)

        }
    }

}