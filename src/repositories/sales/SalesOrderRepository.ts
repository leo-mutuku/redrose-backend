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
        order_items,
        waitstaff_id
    }: SalesOrder): Promise<SalesOrder> {
        try {
            // Prepare store item JSON
            const qry = `SELECT * FROM kitchen_setup WHERE menu_item_id = $1`;
            const v1 = [order_items[0].menu_item_id];
            const r1 = await this.client.query(qry, v1);
            console.log(r1.rows[0]);

            const menu_json = JSON.stringify(order_items);

            // Get array of setup IDs
            const setupids: number[] = [];
            if (order_items) {
                for (const item of order_items) {
                    setupids.push(item.menu_item_id);
                }
            }
            console.log(setupids);

            const setupid = r1.rows[0]?.kitchen_setup_id;
            if (!setupid) {
                throw new AppError('Kitchen setup ID not found.', 404);
            }

            // Fetch ingredients for the setup
            type StoreObject = {
                quantity: number,
                store_item_id: number,
                source_type: string

            }
            let stores: StoreObject[] = []
            for (let item of setupids) {
                console.log(item, "item")
                const qry2 = `SELECT * FROM kitchen_setup WHERE menu_item_id = $1`;
                const v2 = [item];
                const r2 = await this.client.query(qry2, v2);
                let ingredients_id = parseInt(r2.rows[0].kitchen_setup_id)
                console.log(ingredients_id, "ing")
                // get ingredients seting , pick, store_item, quantity and source_type
                let qry3 = `select * from kitchen_ingredients where ingredients_id = $1`
                let v3 = [ingredients_id]
                let r3 = await this.client.query(qry3, v3)
                if (!r3.rows.length) {
                    throw new AppError("Error in ingredients setup, one of the item in the menu is not set well", 500)
                }
                for (let item of r3.rows) {
                    console.log(item, "item")
                    stores.push({
                        quantity: parseFloat(item.quantity),
                        store_item_id: item.store_item_id,
                        source_type: item.source_type
                    })
                }

                console.log(stores, "stores")
            }

            if (!stores.length) {
                throw new AppError("Store item in one of tour chosen meal is not setup properly", 500)
            };
            const updatedData = stores.map((item) => ({
                ...item,
                quantity: (item.quantity * order_items[0].quantity).toFixed(4), // Multiply and format
            }));

            const store_json = JSON.stringify(updatedData);

            // Call the sales order processing function
            console.log(menu_json, store_json)

            //  sales order start here 
            // get order items and prices from menu item 
            type OrderDetails = {
                menu_item_id: number,
                quantity: number,
                price: number,
                total_price: number
            }
            let order_details: OrderDetails[] = []

            for (let item of order_items) {
                let qry4 = `select * from menu_item where menu_item_id = $1`
                let v4 = [item.menu_item_id]
                let r4 = await this.client.query(qry4, v4)

                order_details.push({
                    menu_item_id: r4.rows[0].menu_item_id,
                    quantity: item.quantity,
                    price: r4.rows[0].price,
                    total_price: parseFloat(r4.rows[0].price) * item.quantity
                })
            }
            type sales_order_type = {
                order_details: OrderDetails[],
                sales_order_id: number,
                total: number,
                cat: number,
                vat: number,
                status: "New",
            }
            let sales_order: sales_order_type = {
                order_details,
                sales_order_id: 0,
                cat: (order_details.reduce((acc, item) => acc + item.total_price, 0)) * 0.02,
                vat: (order_details.reduce((acc, item) => acc + item.total_price, 0)) * 0.16,
                total: order_details.reduce((acc, item) => acc + item.total_price, 0),
                status: "New"
            }

            let order_query = `INSERT INTO sales_order 
            (order_details, total, cat, vat, status) VALUES ($1, $2, $3, $4, $5) RETURNING sales_order_id`
            console.log(sales_order, "sales order")

            // I
            const result = await this.client.query(
                `SELECT * FROM sales_order_processing($1::JSON, $2::JSON);`,
                [menu_json, store_json]
            );


            //  Prepare sales order data
            // select from menu item 

            // Prepare 
            // Build and return the result
            const salesOrder: SalesOrder = {
                order_items, waitstaff_id
                // Include additional properties if necessary
            };

            return salesOrder;
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
