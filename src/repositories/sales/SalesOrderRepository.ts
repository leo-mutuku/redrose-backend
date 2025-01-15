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
        waitstaff_id,
        secure_staff_id,
        pin
    }: SalesOrder): Promise<any> {
        try {
            // validate order_items
            // validate waitstaff_id
            // waitstaff_id = 4
            // if (!waitstaff_id) {
            //     if (!secure_staff_id) {
            //         throw new Error(`Waiter Account not verified!`);
            //     }
            // }
            // if (waitstaff_id) {
            //     // validate pin
            //     console.log("validate pin")
            //     const qry = `SELECT pin FROM waitstaff WHERE waitstaff_id = $1`;
            //     const values = [waitstaff_id];
            //     const result = await this.client.query(qry, values);
            //     if (!result.rows.length) {
            //         throw new AppError('Invalid waitstaff_id', 400);
            //     }
            //     if (result.rows[0].pin !== pin) {
            //         throw new AppError('Invalid pin', 400);
            //     }
            // }
            // // authorize staff using secure_staff_id
            // if (secure_staff_id) {
            //     const qry = `SELECT pin FROM waitstaff WHERE waitstaff_id = $1`;
            //     const values = [secure_staff_id];
            //     const result = await this.client.query(qry, values);
            //     if (result.rows.length === 0) {
            //         throw new AppError('Invalid secure_staff_id', 400);

            //     }
            //     if (result.rows[0].pin !== pin) {
            //         throw new AppError('Invalid pin', 400);
            //     }
            //     waitstaff_id = secure_staff_id;
            // }

            // console.log(waitstaff_id, secure_staff_id);
            // validate inputs  --

            waitstaff_id = 4  // pin
            // Prepare store item JSON

            // validate   managed menu non managed menu
            // menu setup must exist
            for (let item of order_items) {
                const qry = `select menu_item_id from kitchen_setup where menu_item_id = $1`
                const values = [item.menu_item_id]
                const res = await this.client.query(qry, values)
                if (!res.rows.length) {
                    throw new AppError("Missing menu setup!")
                }

            }

            // check if item stock exist if managed

            const get_active_shift_qry = `SELECT shift_id FROM active_shift`;
            const get_active_shift_values = [];
            const get_active_shift_result = await this.client.query(get_active_shift_qry);
            const shift_id = get_active_shift_result.rows[0]?.shift_id;

            if (!shift_id) {
                throw new AppError('No active shift found.', 404);
            }
            const qry = `SELECT * FROM kitchen_setup WHERE menu_item_id = $1`;
            const v1 = [order_items[0].menu_item_id];
            const r1 = await this.client.query(qry, v1);


            const menu_json = JSON.stringify(order_items);

            // Get array of setup IDs
            const setupids: number[] = [];
            if (order_items) {
                for (const item of order_items) {
                    setupids.push(item.menu_item_id);
                }
            }


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
                        store_item_id: parseFloat(item.store_item_id),
                        source_type: item.source_type
                    })
                }
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
            //  sales order start here 
            // get order items and prices from menu item 
            type OrderDetails = {
                menu_item_id: number,
                quantity: number,
                price: number,
                total_price: number,
                shift_id: number,
                waittstaff_id: number,
            }
            let order_details: OrderDetails[] = []
            for (let item of order_items) {
                let qry4 = `select * from menu_item where menu_item_id = $1`
                let v4 = [item.menu_item_id]
                let r4 = await this.client.query(qry4, v4)
                order_details.push({
                    menu_item_id: parseInt(r4.rows[0].menu_item_id),
                    quantity: item.quantity,
                    price: r4.rows[0].price,
                    total_price: parseFloat(r4.rows[0].price) * item.quantity
                    , shift_id: shift_id,
                    waittstaff_id: waitstaff_id
                })
            }
            type sales_order_type = {
                order_details: OrderDetails[],
                sales_order_id: number,
                total: number,
                cat: number,
                vat: number,
                status: string,
                waitstaff_id: number,
                shift_id: number
            }
            let sales_order: sales_order_type = {
                order_details,
                sales_order_id: 0,
                cat: (order_details.reduce((acc, item) => acc + item.total_price, 0)) * 0.02,
                vat: (order_details.reduce((acc, item) => acc + item.total_price, 0)) * 0.16,
                total: order_details.reduce((acc, item) => acc + item.total_price, 0),
                status: "New",
                waitstaff_id: waitstaff_id,
                shift_id: shift_id
            }
            let order_query = `INSERT INTO sales_order_entry 
            (status, waitstaff_id, shift_id) VALUES ($1, $2,$3 ) RETURNING *`;
            let order_values = ["New", waitstaff_id, shift_id];
            let order_result = await this.client.query(order_query, order_values);

            const sales_order_entry_id = parseInt(order_result.rows[0].sales_order_entry_id)
            console.log("-----before sales order processing")
            const result = await this.client.query(
                `SELECT * FROM sales_order_process($1::JSON, $2::JSON);`,
                [menu_json, store_json]
            );
            if (!result) {
                throw new AppError("Sorry one of menu entry is out of stock", 500)
            }
            // update sales order entry table
            let update_query =
                `UPDATE sales_order_entry SET 
                status = $1, total_value = $2, cat = $3, vat = $4
                WHERE sales_order_entry_id = $5`;
            let update_values =
                ['Posted', sales_order.total, sales_order.cat, sales_order.vat, sales_order_entry_id];
            let update_result = await this.client.query(update_query, update_values);
            // insert into sales order detail
            for (let item of order_details) {
                console.log(item)
                let sales_order_detail_query =
                    `INSERT INTO sales_order_details
            (menu_item_id, quantity, price, total, shift_id, waitstaff_id, sales_order_entry_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
                let sales_order_detail_values =
                    [item.menu_item_id, item.quantity, item.price, item.total_price, item.shift_id, item.waittstaff_id, sales_order_entry_id];
                await this.client.query(sales_order_detail_query, sales_order_detail_values);
            }
            // sales object
            sales_order.sales_order_id = sales_order_entry_id
            sales_order.status = "Posted"

            return sales_order;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            }
            throw new Error('Error creating sales order: ' + error);
        }
    }

    // Get a list of sales orders with pagination
    async getSalesOrders(search: number, status: string, limit: number, offset: number): Promise<any[]> {
        try {
            console.log("test")
            const query = `
              SELECT 
                    so.sales_order_entry_id,
                    so.total_value,
                    s.first_name as waiter,
                    so.status,
					so.vat,
					so.cat,
                    jsonb_agg(
                        jsonb_build_object(
                            'menu_item_id', mi.menu_item_id,
                            'menu_name', mr.name,
							'sales_order_entry_id', so.sales_order_entry_id,
                            'quantity', sod.quantity,
                            'price', sod.price,
                            'total', sod.quantity * sod.price
                        )
                    ) AS order_details
                FROM 
                    sales_order_entry so
                INNER JOIN 
                    staff s ON s.staff_id = so.waitstaff_id
                LEFT JOIN 
                    sales_order_details sod ON sod.sales_order_details_id = so.sales_order_entry_id
                LEFT JOIN 
                    menu_item mi ON mi.menu_item_id = sod.menu_item_id
                LEFT JOIN 
                    menu_register mr ON mr.menu_register_id = mi.menu_register_id
				        GROUP BY 
                    so.sales_order_entry_id, so.total_value, s.first_name
					LIMIT $1 OFFSET $2
            `;

            // Add limit and offset as the last parameters in queryParams


            // Execute the query with the dynamic parameters
            const result = await this.client.query(query, [limit, offset]);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching sales orders: ' + error, 500);
        }


    }


    async authWaiter(pin: number, staff_id: number): Promise<any> {

        try {

        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(error.message, error.statusCode);
            }
            throw new Error('Error creating sales order: ' + error);

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
