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
        purchase_date, total, from_, from_id, account_type, pay_mode, bank_id, cash_account_id, order_details, staff_id, shift_id

    }: PurchaseOrder): Promise<any> {
        try {
            total = Number(total)

            let vat_total = 0
            for (let item of order_details) {
                if (item.vat_type == "INCLUSIVE") {
                    vat_total += Number(item.total_price) * 16 / 100
                }
            }
            // check if total = to sum of total_price from order_details  -- for user validation to avoid dirty entries
            console.log(total !== order_details.reduce((sum, item) => sum + Number(item.total_price), 0))
            console.log(typeof (total), order_details.reduce((sum, item) => sum + item.total_price, 0))
            if (total !== order_details.reduce((sum, item) => sum + Number(item.total_price), 0)) {
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
            console.log("-------------------------   ====")

            // update paying account balance
            if (pay_mode == "CASH") {
                if (account_type == "CASH") {
                    const get_cash_account = `select * from cash_accounts where cash_account_id = $1`
                    const get_values = [cash_account_id]
                    const cash_account_res = await this.client.query(get_cash_account, get_values)
                    cash_account_balance = cash_account_res.rows[0].balance
                }
                if (account_type == "BANK") {
                    const get_bank = `select * from banks where bank_id = $1`
                    const get_values = [bank_id]
                    const bank_res = await this.client.query(get_bank, get_values)
                    bank_balance = bank_res.rows[0].balance
                }
            }

            // purchase order 
            const insert_purchase_order = ` insert into purchase_order (purchase_date, total, from_, from_id, pay_mode, account_type, bank_id, cash_account_id, purchase_order_total, vat_total, created_by,shift_id) 
            values($1, $2, $3 , $4,$5, $6,$7,$8, $9, $10, $11, $12) RETURNING *`
            console.log("=======")
            const insert_values = [purchase_date, total, from_, from_id, pay_mode, account_type, bank_id, cash_account_id, total, vat_total, staff_id, shift_id]

            const purchase_order_res = await this.client.query(insert_purchase_order, insert_values)
            // purchase order details
            for (let item of order_details) {
                const insert_purchase_order_details =
                    ` insert into purchase_order_details (purchase_order_id, store_item_id, buying_price, quantity, total_price, vat_type, vat)
            values($1, $2, $3 , $4,$5, $6,$7) RETURNING *`
                const insert_values = [Number(purchase_order_res.rows[0].purchase_order_id), Number(item.store_item_id), Number(item.buying_price), Number(item.quantity), Number(item.total_price), item.vat_type, 0]
                await this.client.query(insert_purchase_order_details, insert_values)

                // update current buying pricing - store_item table
                const update_buying_price = `update store_item set buying_price = $1 where store_item_id = $2`
                const update_buying_price_values = [item.buying_price, item.store_item_id]
                const res_buying_price = await this.client.query(update_buying_price, update_buying_price_values)
            }

            // update store items
            for (let item of order_details) {
                const update_store_item = `update store_item set quantity = quantity + $1 where store_item_id = $2 RETURNING *`
                const update_values = [item.quantity, item.store_item_id]
                const res = await this.client.query(update_store_item, update_values)
                // update item tracking 
                const qry = `insert into item_tracking(store_item_id, current_quantity, new_quantity, reason, action_by)
                values($1, $2,$3,$4,$5) `;
                const values = [item.store_item_id, parseFloat(res.rows[0].quantity) - item.quantity, parseFloat(res.rows[0].quantity), 'Local Purchase order', staff_id];
                const res2 = await this.client.query(qry, values)
            }
            // if payment mode cash
            if (pay_mode == "CASH") {
                // update suppplier balance, supplier entries
                if (from_ == "SUPPLIER") {
                    const update_supplier_balnce = `update suppliers set balance = balance + $1 where supplier_id = $2`
                    const supplier_values = [total, supplier_id]
                    const supplier_res = await this.client.query(update_supplier_balnce, supplier_values)
                    // update supplier entries
                }
                if (from_ == "VENDOR") {
                    const update_vendor_balance = `update vendors set balance = balance`
                    const vendor_values = [total, vendor_id]
                    const vendor_res = await this.client.query(update_vendor_balance, vendor_values)
                    // update vendor entries

                }

            }

            // if pay mode = Credit
            if (pay_mode == "CREDIT") {
                // update supplier
                // update vendor
            }









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
                setClauses.push(`${key} = $${index + 1} `);
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
