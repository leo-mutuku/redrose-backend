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
    async updateStaff(id: number, staff: Staff): Promise<Staff> {
        try {
            // Step 1: Fetch the existing staff details from the database
            const existingQuery = 'SELECT * FROM staff WHERE staff_id = $1';
            const existingResult = await this.client.query(existingQuery, [id]);

            if (existingResult.rows.length === 0) {
                throw new AppError('Staff member not found', 404);
            }

            const existingData = existingResult.rows[0];

            // Step 2: Dynamically construct the update query
            const updates: string[] = [];
            const values: any[] = [];
            let index = 1; // Positional parameter index for PostgreSQL ($1, $2, ...)

            for (const key in staff) {
                if (Object.prototype.hasOwnProperty.call(staff, key)) {
                    const value = staff[key as keyof StaffInput];

                    // Check if the value is different from the existing value
                    if (value !== undefined && value !== existingData[key]) {
                        updates.push(`${key} = $${index}`);
                        values.push(value);
                        index++;
                    }
                }
            }

            // Step 3: If no fields have changed, throw an error
            if (updates.length === 0) {
                throw new AppError('No fields were changed', 400);
            }

            // Step 4: Construct and execute the UPDATE query
            const updateQuery = `
                UPDATE staff
                SET ${updates.join(', ')}
                WHERE staff_id = $${index}
                RETURNING *;
            `;
            values.push(id); // Add the staff_id as the last parameter

            const result = await this.client.query(updateQuery, values);

            // Step 5: Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating staff' + error, 400)

        }
    }

}