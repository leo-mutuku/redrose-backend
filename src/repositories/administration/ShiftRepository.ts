import { Shift } from "../../entities/administration/Shift";
import { IShiftRepository } from "../../interfaces/administation/IShiftRepository";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";
import { injectable } from "inversify";
import { AppError } from "../../utils/AppError";

@injectable()
export class ShiftRepository implements IShiftRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createRole(shift: Shift): Promise<Shift> {
        try {
            const result = await this.client.query(`INSERT INTO shifts (shift_start, shift_end) VALUES ($1, $2) RETURNING *`, [shift.shift_start, shift.shift_end])
            return result.rows[0]


        } catch (error) {
            throw new AppError("Error creating shift", 500)

        }
    }
    async getRole(username: string): Promise<Shift> {
        try {
            const result = await this.client.query(`SELECT * FROM shifts WHERE shift_id = $1`, [username])
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error getting shift", 500)

        }
    }
    async getRoles(shift: Shift): Promise<Shift> {
        try {
            const result = await this.client.query(`SELECT * FROM shifts WHERE shift_start = $1 AND shift_end = $2`, [shift.shift_start, shift.shift_end])
            return result.rows[0]
        } catch (error) {
            throw new AppError("Error getting shifts", 500)
        }
    }
    async updateRole(id: number, shift: Shift): Promise<Shift> {
        try {
            const result = await this.client.query(`UPDATE shifts SET shift_start = $1, shift_end = $2 WHERE shift_id = $3 RETURNING *`, [shift.shift_start, shift.shift_end, id])
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error updating shift", 500)
        }
    }
}