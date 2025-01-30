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
        staff_id,
    }: SalesOrder): Promise<any> {
        try {
            // get active shift
            const shift_qry = `select shift_id from active_shift limit 1`
            const shift_res = await this.client.query(shift_qry)
            if (!shift_res.rows.length) {
                throw new AppError(`No active shift found`, 404);
            }
            const shift_id = shift_res.rows[0].shift_id
            // check if order items is empty
            if (!order_items) {
                throw new Error(`Cart is empty!`);
            }

            // check if waitstaff_id is empty

            if (!staff_id) {
                throw new Error(`Waitstaff id is required!`);
            }
            // check if staff has waitstaff  account
            const qry = `select * from waitstaff where staff_id = $1`
            const values = [staff_id]
            const res = await this.client.query(qry, values)
            if (!res.rows.length) {
                throw new AppError(`We could not verify your waiter account `, 404);
            }

            // menu details
            type menu_detail = {
                menu_item_id: number,
                name: string,
                quantity: number,
                price: number,
                total_price: number,
                status: string,
            }
            let menu_details: menu_detail[] = [];

            // get menu setup from kitchen_setup
            for (let item of order_items) {
                const qry = `select * from menu_item as mi inner join menu_register as mr on mi.menu_register_id 
                = mr.menu_register_id where mi.menu_item_id = $1`
                const values = [item.menu_item_id]
                const res = await this.client.query(qry, values)
                if (!res.rows.length) {
                    throw new AppError("Menu item does not exist!", 400);
                }
                // update menu details with menu_item_id
                menu_details.push({
                    menu_item_id: item.menu_item_id,
                    name: res.rows[0].name,
                    quantity: item.quantity,
                    price: parseFloat(res.rows[0].price),
                    total_price: item.quantity * res.rows[0].price,
                    status: "pending"
                })

            }

            // group managed menu and not managed menu
            // get menu source type setup from kitchen setup


            let managed_menus: menu_detail[] = [];
            let unmanaged_menu: menu_detail[] = [];
            for (let item of menu_details) {
                const qry = `select * from kitchen_setup where menu_item_id = $1`
                const values = [item.menu_item_id]
                const res = await this.client.query(qry, values)
                if (!res.rows.length) {
                    throw new AppError(`${item.name} does not have kitchen settings!`, 400);
                }
                if (res.rows[0].managed === "MANAGED") {
                    managed_menus.push(item)
                }
                if (res.rows[0].managed === "UNMANAGED") {
                    unmanaged_menu.push(item)
                }
            }
            // for the managed group required store time based on store item source
            type ingredient_detail = {
                store_item_id: number,
                name?: string,
                quantity: number,
                source: string,
                unit_value: number,
                total_quantity: number,
            }
            let ingredient_details: ingredient_detail[] = [];
            for (let item of managed_menus) {
                // get ingredient details from kitchen setup where menu_item_id = item.menu_item_id
                let menu_order_quantity = item.quantity;
                const qry = `select * from kitchen_setup where menu_item_id = $1`
                const values = [item.menu_item_id]
                const res = await this.client.query(qry, values)
                if (!res.rows.length) {
                    throw new AppError(`${item.name} does not have kitchen settings!`, 400);

                    // update ingredient details with store_item_id
                }
                // get ingredients_id
                const ingredients_id = parseInt(res.rows[0].kitchen_setup_id);

                // get ingredients from ingredients_id
                const ingredients_qry = `select ki.ingredients_id, ki.quantity, ki.source_type, ki.store_item_id from kitchen_ingredients as ki
                    inner join  store_item as 
                    si on ki.store_item_id = si.store_item_id 
                    where ki.ingredients_id = $1`
                const ingredients_values = [ingredients_id]
                const ingredients_res = await this.client.query(ingredients_qry, ingredients_values)
                if (!ingredients_res.rows.length) {
                    const qry = `select ir.item_name from store_item as si   inner join item_register as ir on si.item_id = ir.item_id where si.store_item_id = $1`
                    const values = [ingredients_id]
                    const res = await this.client.query(qry, values)
                    throw new AppError(`${res.rows[0].item_name} does not have ingredients!`, 400);

                }
                for (let ingredient of ingredients_res.rows) {
                    ingredient_details.push({
                        store_item_id: parseInt(ingredient.store_item_id),
                        name: ingredient.item_name,
                        quantity: menu_order_quantity,
                        source: ingredient.source_type,
                        unit_value: parseFloat(ingredient.quantity),
                        total_quantity: parseFloat(ingredient.quantity) * menu_order_quantity
                    })
                }

            }

            function groupAndVerifyData(data: ingredient_detail[]): any[] {
                // Group the data by store_item_id and source
                const groupedData: { [key: string]: { quantity: number; total_quantity: number } } = {};

                data.forEach(item => {
                    const key = `${item.store_item_id}-${item.source}`;

                    if (!groupedData[key]) {
                        groupedData[key] = { quantity: 0, total_quantity: 0 };
                    }

                    // Sum up the quantities and total quantities
                    groupedData[key].quantity += item.quantity;
                    groupedData[key].total_quantity += item.total_quantity;
                });

                // Convert the grouped data back into an array and verify
                return Object.keys(groupedData).map(key => {
                    const [store_item_id, source] = key.split('-');
                    const group = groupedData[key];
                    return {
                        store_item_id: parseInt(store_item_id),
                        source,
                        quantity: group.quantity,
                        total_quantity: group.total_quantity,
                        // Verify the expected values based on the input data
                        verified_quantity: group.quantity, // This is the expected sum of quantities
                        verified_total_quantity: group.total_quantity // This is the expected sum of total_quantities
                    };
                });
            }

            // Running the function with the provided data
            const verifiedData = groupAndVerifyData(ingredient_details);

            // check stock id available or not
            for (let item of verifiedData) {
                // if source = KITTCHEN
                if (item.source === 'KITCHEN') {
                    // check stock id available or not
                    const qry = `select * from kitchen_store where store_item_id = $1`
                    const values = [item.store_item_id]
                    const res = await this.client.query(qry, values)
                    if (!res.rows.length) {
                        throw new AppError(`${item.name} does not have kitchen settings!`, 400);
                    }
                    // compare qantity and total_quantity shoul be greater than item.total_quantity
                    if (item.total_quantity > parseFloat(res.rows[0].quantity)) {
                        // get item name
                        const qry = `select ir.item_name from store_item as si   inner join item_register as ir on si.item_id = ir.item_id where si.store_item_id = $1`
                        const values = [item.store_item_id]
                        const res = await this.client.query(qry, values)
                        throw new AppError(`${res.rows[0].item_name} does not have enough quantity!`, 400);
                    }
                }
                if (item.source === 'RESTAURANT') {
                    // check stock id available or not
                    const qry = `select * from restaurant_store where store_item_id = $1`
                    const values = [item.store_item_id]
                    const res = await this.client.query(qry, values)
                    if (!res.rows.length) {
                        const qry = `select ir.item_name from store_item as si   inner join item_register as ir on si.item_id = ir.item_id where si.store_item_id = $1`
                        const values = [item.store_item_id]
                        const res = await this.client.query(qry, values)
                        throw new AppError(`${res.rows[0].item_name} does not have restaurant settings!`, 400);
                    }
                    // compare qantity and total_quantity shoul be greater than item.total_quantity
                    if (item.total_quantity > parseFloat(res.rows[0].quantity)) {
                        // get item name
                        const qry = `select ir.item_name from store_item as si   inner join item_register as ir on si.item_id = ir.item_id where si.store_item_id = $1`
                        const values = [item.store_item_id]
                        const res = await this.client.query(qry, values)
                        throw new AppError(`${res.rows[0].item_name} does not have enough quantity!`, 400);
                    }
                }
            }

            // deduct quantity from kitchen store and restaurant store
            for (let item of verifiedData) {
                // if source = KITTCHEN
                if (item.source === 'KITCHEN') {
                    // update kitchen store
                    const qry = `update kitchen_store set quantity = quantity - $1 where store_item_id = $2 returning *`
                    const values = [item.total_quantity, item.store_item_id]
                    const res = await this.client.query(qry, values)
                    // update kitchen tracking table
                    const qry2 = `insert into hot_kitchen_tracking (store_item_id, current_quantity, new_quantity, reason, action_by)
                    values($1, $2,$3, $4, $5)  `
                    const values2 = [item.store_item_id, parseFloat(res.rows[0].quantity) - item.total_quantity, parseFloat(res.rows[0].quantity), "Sales order procesing", staff_id];
                    const res2 = await this.client.query(qry2, values2)

                }
                if (item.source === 'RESTAURANT') {
                    // update restaurant store
                    const qry = `update restaurant_store set quantity = quantity - $1 where store_item_id = $2 returning *`
                    const values = [item.total_quantity, item.store_item_id]
                    const res = await this.client.query(qry, values)
                    // update restaurant tracking table
                    const qry1 = `insert into restaurant_tracking (store_item_id, current_quantity, new_quantity, reason, action_by)
                    values ($1, $2,$3, $4, $5)`;
                    const values2 = [item.store_item_id, parseFloat(res.rows[0].quantity) - item.total_quantity, parseFloat(res.rows[0].quantity), "S order processing", staff_id];
                }
            }
            // update menu count
            for (let item of menu_details) {
                // menu_items
                const qry = `update menu_item set quantity = quantity + $1 where menu_item_id = $2 Returning *`
                const values = [item.quantity, item.menu_item_id]
                const res = await this.client.query(qry, values)
                //menu tracking 
                const qry2 = `insert into menu_tracking (menu_item_id, current_quantity, new_quantity, reason, action_by)
                values($1, $2, $3, $4,$5)`
                const values2 = [item.menu_item_id, parseFloat(res.rows[0].quantity) - item.quantity, parseFloat(res.rows[0].quantity), "Sales orser processing", staff_id]
                const res2 = await this.client.query(qry2, values2)
            }

            // actual transaction start here
            // 1 create sales order entry





            const sales_order_query = `insert into sales_order_entry ( total_value, vat, cat, waitstaff_id, status, shift_id)
             values ($1, $2, $3, $4, $5, $6) returning sales_order_entry_id`
            let tv = menu_details.reduce((acc, item) => acc + item.price * item.quantity, 0);
            let vat = tv * 0.16;
            let cat = tv * 0.05;

            const sales_order_values = [tv, vat, cat, staff_id, 'Posted', shift_id]
            console.log(sales_order_values, sales_order_query)

            const sales_order_res = await this.client.query(sales_order_query, sales_order_values)


            const sales_order_id = parseInt(sales_order_res.rows[0].sales_order_entry_id)
            // create sales order details
            for (let item of menu_details) {
                const sales_order_details_query = `insert into sales_order_details 
                (sales_order_entry_id, menu_item_id, price, quantity, total, shift_id, waitstaff_id, status)
                 values ($1, $2, $3, $4, $5, $6, $7,$8) returning sales_order_details_id`
                const sales_order_details_values = [sales_order_id, item.menu_item_id, item.price, item.quantity, item.total_price, shift_id, staff_id, "Posted"]
                console.log(sales_order_details_values, sales_order_details_query)

                await this.client.query(sales_order_details_query, sales_order_details_values)
            }

            const d = new Date();

            const day = String(d.getDate()).padStart(2, '0'); // Add leading zero if day is less than 10
            const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');

            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;


            const get_staff = `select * from staff where staff_id = $1`
            const staff_res = await this.client.query(get_staff, [staff_id])
            const staff = staff_res.rows[0]
            const staff_name = staff.first_name
            const date = formattedDate
            const header = { sales_order_id, tv, vat, cat, staff_name, shift_id, date }

            return { menu_details, header }
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

            const query = `
               SELECT 
                    so.sales_order_entry_id,
					so.created_at,
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
                     sales_order_details sod ON sod.sales_order_entry_id = so.sales_order_entry_id
                LEFT JOIN 
                    menu_item mi ON mi.menu_item_id = sod.menu_item_id
                LEFT JOIN 
                    menu_register mr ON mr.menu_register_id = mi.menu_register_id
				        GROUP BY 
                    so.sales_order_entry_id, so.total_value, s.first_name
					ORDER BY so.created_at DESC
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

    //voidedBill
    async voidedBill(bill_id: any): Promise<any> {
        try {
            const qry = `select * from sales_order_entry where sales_order_entry_id = $1`;
            const result = await this.client.query(qry, [bill_id]);

            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }
            if (result.rows[0].status !== 'Posted') {
                throw new AppError('Bill must be Poisted before void!', 404);
            }

            // logic to return kitchen or restaurant items
            // get sales order details
            const qry1 = `select * from sales_order_details where sales_order_entry_id = $1`;
            const result1 = await this.client.query(qry1, [bill_id]);
            // get menu_item_id and quantity
            type Item = {
                menu_item_id: number;
                quantity: number;
            };
            const Items: Item[] = [];
            // details must  exist
            if (!result1.rows.length) {
                throw new AppError('Bill must have items!', 404);
            }
            for (let x of result1.rows) {
                Items.push(x.menu_item_id, x.quantity);
            }

            //  menu items 
            console.log(Items)

            const qry2 = `update sales_order_entry set status = 'Voided' where sales_order_entry_id = $1`;
            const result2 = await this.client.query(qry2, [bill_id]);

            return { message: 'Bill voided successfully', rowCount: result2.rowCount };




        } catch (error) {
            throw new AppError(': ' + error, 500);
        }
    }
    async printBill(bill_id: any): Promise<any> {
        try {
            console.log(bill_id)
            const qry = `select * from sales_order_entry where sales_order_entry_id = $1`;
            const result = await this.client.query(qry, [bill_id]);
            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new AppError('Error fetching sales order: ' + error, 500);
        }
    }

    async cancelBill(bill_id: any): Promise<any> {
        try {
            // check if the bill exists
            const qry = `select * from sales_order_entry where sales_order_entry_id = $1`;
            const result = await
                this.client.query(qry, [bill_id]);
            if (result.rows.length === 0) {
                throw new AppError('Sales order not found', 404);
            }
            //
            const qry1 = `update sales_order_entry set status = 'Cancelled' where sales_order_entry_id = $1`;
            const result1 = await this.client.query(qry1, [bill_id]);
            return result1.rowCount;

        } catch (error) {
            throw new AppError("" + error, 400)
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
