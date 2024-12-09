import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { SalesOrder } from "../../entities/sales/SalesOrder";
import { ISalesOrderRepository } from "../../interfaces/sales/ISalesOrderRepository";
@injectable()
export class SalesOrderRepository implements ISalesOrderRepository {
    private client: Pool;
    constructor() {
        this.client = pgClient();
    }
    // Create a new sales order
    async createSalesOrder({
        order_items
    }: SalesOrder): Promise<SalesOrder> {
        try {
            // prepare store item json
            const qry = `select * from kitchen_setup where menu_item_id  = $1`
            const v1 = [order_items[0].menu_item_id]
            const r1 = await this.client.query(qry, v1)
            let menu_json = JSON.stringify(order_items)
            let setupid = r1.rows[0].kitchen_setup_id
            let qry2 = 'select * from kitchen_ingredients where ingredients_id =$1'
            let v2 = [setupid]
            let r2 = await this.client.query(qry2, v2)
            let store = r2.rows;
            const updatedData = store.map(item => ({
                ...item,
                quantity: (parseFloat(item.quantity) * order_items[0].quantity).toFixed(2) // Multiply and format
            }));
            let store_json = JSON.stringify(updatedData);
            let result1;
            (async () => {
                try {
                    const result = await this.client.query(
                        `SELECT * FROM sales_order_processing($1::JSON, $2::JSON);`,
                        [menu_json, store_json]
                    );
                    console.log('Function executed successfully:', result.rows);

                    result1 = result.rows
                } catch (error) {
                    console.error('Error executing function:', error);
                }
            })();


            return result1

        } catch (error) {
            throw new AppError('Error creating sales order: ' + error, 500);
        }
    }

    // Get a list of sales orders with pagination
    async getSalesOrders(limit: number, offset: number): Promise<SalesOrder[]> {
        try {
            const query = `
                SELECT sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
                FROM sales_order
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching sales orders: ' + error, 500);
        }
    }

    // Get a single sales order by ID
    async getSalesOrder(id: number): Promise<SalesOrder> {
        try {
            const query = `
                SELECT sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
                FROM sales_order
                WHERE sales_order_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching sales order: ' + error, 500);
        }
    }

    // Update an existing sales order
    async updateSalesOrder(id: number, salesOrder: Partial<SalesOrder>): Promise<SalesOrder> {
        try {
            let query = `UPDATE sales_order SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(salesOrder).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE sales_order_id = $${values.length + 1} RETURNING 
                sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating sales order: ' + error, 500);
        }
    }

    // Delete a sales order by ID
    async deleteSalesOrder(id: number): Promise<SalesOrder> {
        try {
            const query = `
                DELETE FROM sales_order
                WHERE sales_order_id = $1
                RETURNING sales_order_id, customer_id, order_date, total_amount, status, created_by, created_at
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error deleting sales order: ' + error, 500);
        }
    }
}
