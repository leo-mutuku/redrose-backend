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
            throw new AppError('Error disposing of cashier register: ' + error, 500);
        }
    }
    async clearBill(input: any): Promise<any> {
        try {

            let { bill_ids, mpesa, cash } = input;
            // confirm if user has cashier account
            let shift_id = input.user.shift_id
            let staff_id = input.user.staff_id
            console.log(staff_id)
            const iscashier_qry = `select * from sales_cashiers where staff_id = $1`
            const values_cashier = [input.user.staff_id]
            const cashier_qry_res = await this.client.query(iscashier_qry, values_cashier)
            console.log(!cashier_qry_res.rowCount)
            if (!cashier_qry_res.rowCount) {
                throw new AppError("Not authorized, only cashiers can clear bills")
            }
            let bill_total = 0

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
            console.log("here")
            // cash

            let change = bill_total - (mpesa + cash)
            if (mpesa + cash == bill_total) {
                change = 0
            }

            // 

            let cashier_cash = cash
            let cashier_till = 0

            let cashier_txt_charge = 0
            console.log(mpesa > 199, "txn", mpesa)
            if (mpesa > 199) {
                cashier_txt_charge = mpesa * 0.005
                console.log(cashier_txt_charge, "txn")
            }
            cashier_till = mpesa - cashier_txt_charge

            if (bill_total <= mpesa) {
                cashier_cash = 0
            }
            let credit = cashier_cash + cashier_till + cashier_txt_charge
            // update sales cashier 
            const cashier_update = `update sales_cashiers set till = till + $1, cash = cash + $2, txn_charges = txn_charges + $3 where staff_id = $4 returning *`
            const values_cashier1 = [cashier_till, cashier_cash, cashier_txt_charge, staff_id]
            console.log(values_cashier1)

            const cashier_res1 = await this.client.query(cashier_update, values_cashier1)
            console.log(cashier_res1.rows[0])

            const c_bal = parseFloat(cashier_res1.rows[0].till) + parseFloat(cashier_res1.rows[0].cash) + parseFloat(cashier_res1.rows[0].txn_charges)
            console.log(c_bal, "cashier balance")
            //cashier  statement
            const cashier_statement = `insert into sales_cashier_entries(staff_id, credit, debit, till, cash, txn_charge, description, shift_id, cashier_balance)
                    values($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
            const values_cashier_Statement = [staff_id, credit, 0, cashier_till, cashier_cash, cashier_txt_charge, "Sales order processing", shift_id, parseFloat(cashier_res1.rows[0].till) + parseFloat(cashier_res1.rows[0].cash) + parseFloat(cashier_res1.rows[0].txn_charges)]
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
            const transfer_qry = `update sales_cashiers set till = till - $1, till = till + $2 where staff_id = $3 returning * `

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

    async cashierReport(input: any): Promise<any> {
        try {
            const qry = `SELECT 
    JSONB_BUILD_OBJECT(
        'staff', JSONB_BUILD_OBJECT(
            'staff_id', s.staff_id,
            'name', s.first_name
        ),
        'summary', JSONB_BUILD_OBJECT(
            'total_credit', COALESCE(SUM(sce.credit), 0),
            'total_debit', COALESCE(SUM(sce.debit), 0),
            'final_balance', COALESCE(MAX(sce.cashier_balance), 0)
        ),
        'entries', COALESCE(
            JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'created_at', sce.created_at,
                    'description', sce.description,
                    'credit', sce.credit,
                    'debit', sce.debit,
                    'cashier_balance', sce.cashier_balance
                )
            ) FILTER (WHERE sce.created_at IS NOT NULL), '[]'::JSONB
        )
    )
FROM sales_cashier_entries sce
INNER JOIN staff s ON sce.staff_id = s.staff_id
WHERE 
    sce.staff_id = $1 
    AND sce.created_at BETWEEN $2 AND $3
GROUP BY s.staff_id, s.first_name;`
            const values = [input.staff_id, input.start_date, input.end_date]
            const res = await this.client.query(qry, values)
            return res.rows
        } catch (error) {
            throw new AppError(":" + error, 400)
        }
    }
}
