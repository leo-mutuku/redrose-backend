import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { POSTerminalBill } from "../../entities/sales/POSTerminalBill"


import { IPOSTerminalPrintBillRepository } from "../../interfaces/sales/IPOSTerminalPrintBillRepository";

@injectable()
export class POSTerminalPrintBillRepository implements IPOSTerminalPrintBillRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Initiates the printing of a bill
    async printBill(billData: any): Promise<any> {
        try {
            const { items, customerDetails, totalAmount, cashierId, createdBy } = billData;

            const query = `
                INSERT INTO sales_bills (items, customer_details, total_amount, cashier_id, created_by)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING bill_id, items, customer_details, total_amount, cashier_id, created_by, created_at
            `;
            const values = [JSON.stringify(items), JSON.stringify(customerDetails), totalAmount, cashierId, createdBy];
            const result = await this.client.query(query, values);

            // Here, you could add the actual printing logic if you're interacting with a printer
            // For example, send the bill data to a printer API

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error printing bill: ' + error, 500);
        }
    }

    // Retrieves the print status of a bill
    async getPrintStatus(billId: number): Promise<any> {
        try {
            const query = `
                SELECT bill_id, status, created_at
                FROM sales_bills
                WHERE bill_id = $1
            `;
            const values = [billId];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Bill not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching print status: ' + error, 500);
        }
    }

    // Cancels an ongoing bill printing
    async cancelBillPrinting(billId: number): Promise<any> {
        try {
            const query = `
                UPDATE sales_bills
                SET status = 'Cancelled'
                WHERE bill_id = $1
                RETURNING bill_id, status, updated_at
            `;
            const values = [billId];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Bill not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error cancelling print job: ' + error, 500);
        }
    }

    // Retrieves a list of printed bills with pagination
    async getPrintedBills(limit: number, offset: number): Promise<any[]> {
        try {
            const query = `
                SELECT bill_id, items, customer_details, total_amount, cashier_id, status, created_at
                FROM sales_bills
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching printed bills: ' + error, 500);
        }
    }

    async validateWaiter(input: POSTerminalBill): Promise<any> {
        try {
            const query = `
                SELECT * FROM waitstaff WHERE staff_id = $1 AND pin = $2
            `;
            const values = [input.waiterstaff_id, input.pin];
            const result = await this.client.query(query, values);
            return result.rows;
        }
        catch (error) {
            throw new AppError('Error validating waiter: ' + error, 500);
        }
    }
}
