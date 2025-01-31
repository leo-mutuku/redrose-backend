import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { CashierRegister } from "../../entities/sales/CashierRegister";
import { ICashierRegisterRepository } from "../../interfaces/sales/ICashierRegisterRepository";
import { Statement } from "sqlite3";
@injectable()
export class CashierRegisterRepository implements ICashierRegisterRepository {
    private client: Pool;
    constructor() {
        this.client = pgClient();
    }
    openCashierRegister(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    // Create a new cashier register record
    async createCashierRegister({
        staff_id,
        balance,
        pin,
        created_by
    }: CashierRegister): Promise<CashierRegister> {
        try {
            const query = `
                INSERT INTO sales_cashiers (staff_id,
                balance,
                pin ,
                created_by)
                VALUES ($1, $2, $3, $4 )
                RETURNING sales_cashier_id, staff_id,  balance, created_by, created_at
            `;
            const values = [staff_id,
                balance,
                pin,
                created_by];
            const result = await this.client.query(query, values);
            // get staff phone from staff table
            const staffQuery = `SELECT phone FROM staff WHERE staff_id = $1`;
            const staffResult = await this.client.query(staffQuery, [staff_id]);
            const staffPhone = staffResult.rows[0].phone;
            return { ...result.rows[0], staffPhone };
        } catch (error) {
            throw new AppError('Error creating cashier register: ' + error, 500);
        }
    }

    // Get a list of cashier registers with pagination
    async getCashierRegisters(limit: number, offset: number): Promise<CashierRegister[]> {
        try {
            const query = `
                SELECT  sc.sales_cashier_id, sc.balance,sc.till, sc.cash, sc.txn_charges, sc.staff_id, sc.created_by, sc.created_at,
                s.first_name || ' '||  s.last_name as cashier_name
                FROM sales_cashiers sc
                inner join staff s on s.staff_id = sc.staff_id
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching cashier registers: ' + error, 500);
        }
    }

    // Get a single cashier register by ID
    async getCashierRegister(id: number): Promise<CashierRegister> {
        try {
            const query = `
                SELECT  sc.sales_cashier_id, sc.balance, sc.till, sc.cash, sc.txn_charges, sc.staff_id, sc.created_by, sc.created_at,
                s.first_name || ' '||  s.last_name as cashier_name
                FROM sales_cashiers sc
                inner join staff s on s.staff_id = sc.staff_id
                WHERE sales_cashier_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching cashier register: ' + error, 500);
        }
    }
    // Update an existing cashier register
    async updateCashierRegister(id: number, cashierRegister: Partial<CashierRegister>): Promise<CashierRegister> {
        try {
            let query = `UPDATE sales_cashiers SET `;
            const values: any[] = [];
            let setClauses: string[] = [];
            // Dynamically build the SET clause and values array
            Object.entries(cashierRegister).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });
            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }
            query += setClauses.join(', ');
            query += ` WHERE sales_cashier_id = $${values.length + 1} RETURNING 
                sales_cashier_id, balance,  created_by, created_at`;
            values.push(id);
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating cashier register: ' + error, 500);
        }
    }

    // Delete a cashier register by ID
    async deleteCashierRegister(id: number): Promise<CashierRegister> {
        try {
            const query = `
                DELETE FROM cashier_register
                WHERE cashier_register_id = $1
                RETURNING cashier_register_id, register_number, cashier_id, opening_balance, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Cashier register not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting cashier register: ' + error, 500);
        }
    }

    async dispose(input: any): Promise<any> {
        try {

        } catch (error) {

        }
    }
    async clearBill(input: any): Promise<any> {
        try {

            let { bill_ids, mpesa, cash, staff_id, shift_id } = input;
            // confirm if user has cashier account
            const iscashier_qry = `select * from sales_cashiers where staff_id = $`
            const values_cashier = [staff_id]
            const cashier_qry_res = await this.client.query(iscashier_qry, values_cashier)
            if (cashier_qry_res.rowCount) {
                throw new AppError("Not authorized, only cashiers can clear bills")
            }
            let bill_total = 0
            let txn_charges = 0
            for (let x of bill_ids) {
                const qry = `select total_value, status from sales_order_entry where sales_order_entry_id = $1 `
                const value = [x]
                const res = await this.client.query(qry, value)
                bill_total = bill_total + parseFloat(res.rows[0].total_value)
                if (res.rows[0].status !== 'Posted') {
                    throw new AppError("Status must be Posted only, bill number " + x + " is not")
                }
            }



            if (bill_total > (mpesa + cash)) {
                throw new AppError("Insufient fund, " + (bill_total - (mpesa + cash)) + " more is required")
            }

            // more logic here 
            for (let x of bill_ids) {
                const sql = `update sales_order_entry set status ='Paid' where sales_order_entry_id = $1`
                const values = [x]
                await this.client.query(sql, values)
            }

            // cash
            if (cash > 0) {
                // update cash account
                const update_cash = `update sales_cashiers set cash = cash + $1 where staff_id = $2 returning *`
                const values = [cash, staff_id]
                await this.client.query(update_cash, values)
            }
            // till
            if (mpesa > 0) {
                // update mpesa balance
                if (mpesa > 200) {
                    txn_charges = mpesa * 0.005
                    mpesa = mpesa - txn_charges
                    const update_till = `update sales_cashiers set till = till + $1 where staff_id = $2 returning *`
                    const values = [mpesa, staff_id]
                    await this.client.query(update_till, values)

                    //txn


                }
                else {
                    const update_till = `update sales_cashiers set till = till + $1 where staff_id = $2 returning *`
                    const values = [mpesa, staff_id]
                    await this.client.query(update_till, values)
                }

            }
            if (!cash) {
                cash = 0

            }
            if (!mpesa) {
                mpesa = 0
            }

            let credit = mpesa + cash

            //cashier  statement
            const cashier_statement = `insert into sales_cahsier_entries (staff_id, credit, debit, till, cash, txt_charges, description, shift_id)
            values($1,$2,$3,$4,$5,$6,$7,$8)`;
            const values_cashier_Statement = [staff_id, credit, 0, mpesa, cash, txn_charges, "Sales order processing", shift_id]
            const res = await this.client.query(cashier_statement, values_cashier_Statement)
        }
        catch (error) {
            throw new AppError(': ' + error, 500);
        }
    }
    async cashierTransfer(input
        : any
    ): Promise<any> {
        try {
            let { staff_id, mpesa, till, shift_id } = input;
            // confirm if user has cashier account
            const iscashier_qry = `select * from sales_cashiers where staff_id = $`
            const values_cashier = [staff_id]
            const cashier_qry_res = await this.client.query(iscashier_qry, values_cashier)
            if (!cashier_qry_res.rowCount) {
                throw new AppError("Not authorized, only cashiers can transfer")
            }
            // query to transfer 
            const transfer_qry = `update sales_cashiers set till = till - $1, till = till + $2 where staff_id = $3 returning *`

            // cashier transfer entry

            // bank account, 
            //bank_entries
            // cash account
            //cashier_entries
            // sales_cashiers
            // sales_cashier_entries

        } catch (error) {
            throw new AppError(":" + error, 400)


        }
    }
}
