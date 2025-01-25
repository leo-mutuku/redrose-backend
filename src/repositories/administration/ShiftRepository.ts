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

            // update acctive shift
            const delete_active_shift = `delete from active_shift`
            const delete_active_shift_value = []
            const delete_active_shift_res = await this.client.query(delete_active_shift, delete_active_shift_value)
            const update_active_shift = `INSERT INTO active_shift (shift_id) VALUES ($1)`
            const update_active_shift_value = [result.rows[0].shift_id]
            const update_active_shift_res = await this.client.query(update_active_shift, update_active_shift_value)

            // shift activities
            // 1.0 set all cashier balances to 10,000
            const qry1 = `update sales_cashiers set balance = $1 , cash= $2 , till= $3 , txn_charges= $4`
            const value1 = [10000, 10000, 0, 0]
            const res1 = await this.client.query(qry1, value1)
            // set all menu_item balances to 0
            const qry2 = `update menu_item set quantity = $1 `
            const values2 = [0]
            const res2 = await this.client.query(qry2, values2)
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