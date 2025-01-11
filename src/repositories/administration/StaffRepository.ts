import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IStaffRepository } from "../../interfaces/administation/IStaffRepository";
import { Staff } from "../../entities/administration/Staff";

interface StaffInput {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_active?: boolean;
}


@injectable()
export class StaffRepository implements IStaffRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }

    async createStaff({ first_name, last_name, phone, created_by }: Staff): Promise<Staff> {
        try {
            const query = `INSERT INTO staff (first_name, last_name, phone, created_by)
            VALUES ($1, $2,$3,$4) RETURNING 
            staff_id, first_name, last_name, phone, created_by`
            const value = [first_name, last_name, phone, created_by]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {

            throw new AppError('Error creating staff' + error, 400)
        }
    }
    async getStaff(staff_id: number): Promise<Staff> {
        try {
            const query = `SELECT * FROM staff WHERE staff_id = $1`
            const value = [staff_id]
            let result = await this.client.query(query, value)
            return result.rows[0]

        } catch (error) {
            throw new AppError('Error getting staff' + error, 400)

        }
    }
    async getStaffs(limit: number, offset: number): Promise<Staff[]> {
        try {
            const query = `SELECT * FROM staff WHERE is_active = true LIMIT $1 OFFSET $2`
            const value = [limit, offset]
            let result = await this.client.query(query, value)
            return result.rows

        } catch (error) {
            throw new AppError('Error getting staff' + error, 400)

        }
    }
    async updateStaff(staff_id, staff) {
        try {
            // Define allowed fields for updates
            const allowedFields = ["first_name", "last_name", "email", "phone"]; // Add allowed fields here

            // Fetch the existing staff record
            const existingRecordResult = await this.client.query('SELECT * FROM staff WHERE staff_id = $1', [staff_id]);
            if (existingRecordResult.rows.length === 0) {
                throw new AppError(`Staff with id ${staff_id} not found`, 404);
            }

            const existingRecord = existingRecordResult.rows[0];

            // Filter fields that are both allowed and have changed
            const fieldsToUpdate = Object.keys(staff).filter(
                (field) => allowedFields.includes(field) && staff[field] !== existingRecord[field]
            );

            // If no fields are allowed or changed, return the existing record
            if (fieldsToUpdate.length === 0) {
                return existingRecord;
            }

            // Construct the dynamic query
            const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
            const query = `UPDATE staff SET ${setClauses.join(', ')} WHERE staff_id = $${fieldsToUpdate.length + 1} RETURNING *`;

            // Prepare the values array
            const values = [...fieldsToUpdate.map((field) => staff[field]), staff_id];

            // Execute the query
            const result = await this.client.query(query, values);

            // Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating staff: ' + error, 400);
        }
    }


}