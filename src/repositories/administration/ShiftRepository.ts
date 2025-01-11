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
    async createShift(shift: Shift): Promise<Shift> {
        try {
            const result = await this.client.query(
                `INSERT INTO shift (shift_start,  created_by)
                 VALUES ($1,  $2) 
                RETURNING *`,
                [shift.shift_start, shift.created_by]
            )



            return result.rows[0]


        } catch (error) {
            throw new AppError("Error creating shift" + error, 500)

        }
    }
    async getShift(id: number): Promise<Shift> {
        try {
            const result = await this.client.query(`SELECT * FROM shift WHERE shift_id = $1`, [id])
            return result.rows[0]
        } catch (error) {
            throw new AppError("Error getting shift" + error, 500)
        }
    }
    async getShifts(limit: number, offset: number): Promise<Shift[]> {
        try {
            console.log(limit, offset)
            const result = await this.client.query(
                `SELECT * FROM shift  order by shift_start  desc Limit $1  OFFSET $2 `,
                [limit, offset])
            console.log(result.rows)
            return result.rows
        } catch (error) {
            throw new AppError("Error getting shifts" + error, 500)
        }
    }
    async updateShift(id: number, shift: Shift): Promise<Shift> {
        try {
            const result = await this.client.query(`UPDATE shifts SET shift_start = $1, shift_end = $2 WHERE shift_id = $3 RETURNING *`, [shift.shift_start, shift.shift_end, id])
            return result.rows[0]
        } catch (error) {
            throw new AppError("Error updating shift", 500)
        }
    }
}