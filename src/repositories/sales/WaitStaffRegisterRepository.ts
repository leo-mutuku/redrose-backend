import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { WaitStaffRegister } from "../../entities/waitStaff/WaitStaffRegister";
import { IWaitStaffRegisterRepository } from "../../interfaces/waitStaff/IWaitStaffRegisterRepository";

@injectable()
export class WaitStaffRegisterRepository implements IWaitStaffRegisterRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new wait staff registration
    async createWaitStaffRegister({
        staff_id,
        register_time,
        table_assigned,
        created_by
    }: WaitStaffRegister): Promise<WaitStaffRegister> {
        try {
            const query = `
                INSERT INTO wait_staff_register (staff_id, register_time, table_assigned, created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at
            `;
            const values = [staff_id, register_time, table_assigned, created_by];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating wait staff registration: ' + error, 500);
        }
    }

    // Get a list of wait staff registrations with pagination
    async getWaitStaffRegisters(limit: number, offset: number): Promise<WaitStaffRegister[]> {
        try {
            const query = `
                SELECT wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at
                FROM wait_staff_register
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching wait staff registrations: ' + error, 500);
        }
    }

    // Get a single wait staff registration by ID
    async getWaitStaffRegister(id: number): Promise<WaitStaffRegister> {
        try {
            const query = `
                SELECT wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at
                FROM wait_staff_register
                WHERE wait_staff_register_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Wait staff registration not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching wait staff registration: ' + error, 500);
        }
    }

    // Update an existing wait staff registration
    async updateWaitStaffRegister(id: number, waitStaffRegister: Partial<WaitStaffRegister>): Promise<WaitStaffRegister> {
        try {
            let query = `UPDATE wait_staff_register SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(waitStaffRegister).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE wait_staff_register_id = $${values.length + 1} RETURNING 
                wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Wait staff registration not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating wait staff registration: ' + error, 500);
        }
    }

    // Delete a wait staff registration by ID
    async deleteWaitStaffRegister(id: number): Promise<WaitStaffRegister> {
        try {
            const query = `
                DELETE FROM wait_staff_register
                WHERE wait_staff_register_id = $1
                RETURNING wait_staff_register_id, staff_id, register_time, table_assigned, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Wait staff registration not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting wait staff registration: ' + error, 500);
        }
    }
}
