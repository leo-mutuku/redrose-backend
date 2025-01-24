import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

import { IPurchaseOrderRepository } from "../../interfaces/purchase/IpurchaseOrderRepository";
import { PurchaseOrder } from "../../entities/purchase/PurchaseOrder";
import { Account } from "../../entities/finance/Accounts";

@injectable()
export class PurchaseOrderRepository implements IPurchaseOrderRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new purchase order record
    async createPurchaseOrder({
        purchase_date, total, from_, from_id, account_type, pay_mode, bank_id, cash_account_id, order_details

    }: PurchaseOrder): Promise<any> {
        try {
            // check if total = to sum of total_price from order_details
            console.log(total !== order_details.reduce((sum, item) => sum + item.total_price, 0))
            if (total !== order_details.reduce((sum, item) => sum + item.total_price, 0)) {
                throw new AppError("Possible error notice, the total value must be exactly equal to sum of item's values ")
            }
            // account status
            if (pay_mode == "CASH") {
                if (account_type == "CASH" && !cash_account_id) {
                    throw new AppError("cash account required for cash payment mode")
                }
                if (account_type == "BANK" && !bank_id) {
                    throw new AppError("bank account required for bank payment mode")
                }
            }
            //from supplier || vendor
            let supplier_id = 0
            let supplier_balance = 0
            let vendor_id = 0
            let vendor_balance = 0
            //from = SUPPLIER
            if (from_ == "SUPPLIER") {
                const supplier_query = `select * from suppliers where supplier_id = $1`
                const values = [from_id]
                const supplier_res = await this.client.query(supplier_query, values)
                supplier_balance = supplier_res.rows[0].balance
                supplier_id = from_id
            }
            if (from_ == "VENDOR") {
                const vendor_query = `select * from vendors where vendor_id = $1`
                const values = [from_id]
                const supplier_res = await this.client.query(vendor_query, values)
                vendor_balance = supplier_res.rows[0].balance
                vendor_id = from_id
            }


            // bank 
            let bank_balance = 0
            //cash
            let cash_account_balance = 0

            // update paying account balance
            if (pay_mode == "CASH") {
                if (account_type == "CASH") {
                    const get_cash_account = `select * from cash_accounts where cash_account_id = $1`
                    const get_values = [cash_account_id]
                    const cash_account_res = await this.client.query(get_cash_account, get_values)
                    cash_account_balance = cash_account_res.rows[0].balance
                }
                if (account_type == "BANK") {
                    const get_bank = `select * from banks where banks = $1`
                    const get_values = [bank_id]
                    const bank_res = await this.client.query(get_bank, get_values)
                    bank_balance = bank_res.rows[0].balance
                }
            }








            // update store items


            // purchase order --entries


            // supplier or vendor entries  -- invoicing


            // payment   



        } catch (error) {
            throw new AppError('Error creating purchase order: ' + error, 500);
        }
    }

    // Get a list of purchase orders with pagination
    async getPurchaseOrders(limit: number, offset: number): Promise<PurchaseOrder[]> {
        try {
            const query = `
                SELECT purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
                FROM purchase_order
                LIMIT $1 OFFSET $2z
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching purchase orders: ' + error, 500);
        }
    }

    // Get a single purchase order by ID
    async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
        try {
            const query = `
                SELECT purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
                FROM purchase_order
                WHERE purchase_order_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching purchase order: ' + error, 500);
        }
    }

    // Update an existing purchase order
    async updatePurchaseOrder(id: number, purchaseOrder: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
        try {
            let query = `UPDATE purchase_order SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(purchaseOrder).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE purchase_order_id = $${values.length + 1} RETURNING 
                purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating purchase order: ' + error, 500);
        }
    }

    // Delete a purchase order by ID
    async deletePurchaseOrder(id: number): Promise<PurchaseOrder> {
        try {
            const query = `
                DELETE FROM purchase_order
                WHERE purchase_order_id = $1
                RETURNING purchase_order_id, order_number, supplier_id, order_date, total_amount, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Purchase order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting purchase order: ' + error, 500);
        }
    }
}
