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
                SELECT menu_item_id,menu_register_id, quantity, price, menu_category_id, available,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_item
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
                SELECT menu_item_id,menu_register_id, quantity, price, menu_category_id, available,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_item
                WHERE menu_item_id = $1
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

    async updateMenuItem(id: number, menuItem: Partial<MenuItem>): Promise<MenuItem> {
        try {
            let query = `UPDATE menu_item SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(menuItem).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE menu_item_id = $${values.length + 1} RETURNING 
                 quantity, price, menu_category_id, available
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
}
