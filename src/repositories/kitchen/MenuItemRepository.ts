import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { MenuItem } from "../../entities/kitchen/MenuItem";
import { IMenuItemRepository } from "../../interfaces/kitchen/IMenuItemRepository";

@injectable()
export class MenuItemRepository implements IMenuItemRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createMenuItem({ menu_register_id, quantity, price, menu_category_id, available }: MenuItem): Promise<MenuItem> {
        try {
            const query = `
                INSERT INTO menu_item (menu_register_id, quantity, price, menu_category_id)
                VALUES ($1, $2, $3, $4)
                RETURNING menu_item_id, menu_register_id, quantity, price, menu_category_id, available,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [menu_register_id, quantity, price, menu_category_id];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating menu item: ' + error, 500);
        }
    }

    async getMenuItems(limit: number, offset: number): Promise<MenuItem[]> {
        try {
            const query = `
                
            SELECT mi.menu_item_id,mi.menu_register_id,
	 mi.quantity, mi.price, mi.menu_category_id, mi.available,mr.name as menu_name,
                TO_CHAR(mi.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_item as mi
                inner join menu_register mr on mi.menu_register_id = mr.menu_register_id
                inner join menu_category mc on mi.menu_category_id = mc.menu_category_id
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching menu items: ' + error, 500);
        }
    }

    async getMenuItem(id: number): Promise<MenuItem> {
        try {
            const query = `
                SELECT mi.menu_item_id,mi.menu_register_id,
	            mi.quantity, mi.price, mi.menu_category_id, mi.available,mr.name as menu_name,
                TO_CHAR(mi.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_item as mi
                inner join menu_register mr on mi.menu_register_id = mr.menu_register_id
                inner join menu_category mc on mi.menu_category_id = mc.menu_category_id
                WHERE mi.menu_item_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Menu item not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching menu item: ' + error, 500);
        }
    }

    async getmenuTracking() {
        try {
            let query = `  SELECT 
    m.menu_item_id,
    mr.name,
    mr.menu_register_id,
    m.current_quantity,
    m.new_quantity
FROM 
    menu_tracking m
LEFT JOIN 
    menu_item mi ON m.menu_item_id = mi.menu_item_id  -- Corrected join condition
LEFT JOIN 
    menu_register mr ON mi.menu_register_id = mr.menu_register_id  -- Corrected join condition
ORDER BY 
    m.menu_tracking_id DESC`
            const res = await this.client.query(query)

            return res.rows

        } catch (error) {
            throw new AppError("Error" + error, 500)

        }
    }
    async updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<MenuItem> {
        try {
            const allowedFields = ['quantity', 'price', 'menu_category_id']; // List of fields allowed to update
            let query = `UPDATE menu_item SET `;
            const values: any[] = [];
            const setClauses: string[] = [];

            // Filter the menuItem object to include only allowed fields
            const filteredMenuItem = Object.entries(menuItem).filter(([key]) => allowedFields.includes(key));

            // Dynamically build the SET clause and values array
            filteredMenuItem.forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No valid fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE menu_item_id = $${values.length + 1} RETURNING 
                quantity, 
                price, 
                menu_category_id, 
                available, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu item not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu item: ' + error, 500);
        }
    }

    async deleteMenuItem(id: number): Promise<void> {
        try {
            const query = 'DELETE FROM menu_item WHERE menu_item_id = $1';
            const values = [id];
            const result = await this.client.query(query, values);
            if (result.rowCount === 0) {
                throw new AppError('Menu item not found', 404);
            }
        }
        catch (error) {
            throw new AppError('Error deleting menu item: ' + error, 500);
        }
    }



}

