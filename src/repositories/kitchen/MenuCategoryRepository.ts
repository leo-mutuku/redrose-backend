import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IMenuCategoryRepository } from "../../interfaces/kitchen/IMenuCategoryRepository";
import { MenuCategory } from "../../entities/kitchen/Menucategory";

@injectable()
export class MenuCategoryRepository implements IMenuCategoryRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createMenuCategory({ category_name, description, category_abbr }: MenuCategory): Promise<MenuCategory> {
        try {
            const query = `
                INSERT INTO menu_category (category_name, description, category_abbr)
                VALUES ($1, $2, $3)
                RETURNING menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [category_name, description, category_abbr];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating menu category: ' + error, 500);
        }
    }

    async getMenuCategories(limit: number, offset: number): Promise<MenuCategory[]> {
        try {
            const query = `
                SELECT menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_category
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching menu categories: ' + error, 500);
        }
    }

    async getMenuCategory(id: number): Promise<MenuCategory> {
        try {
            const query = `
                SELECT menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM menu_category
                WHERE menu_category_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Menu category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching menu category: ' + error, 500);
        }
    }

    async updateMenuCategory(id: number, menuCategory: Partial<MenuCategory>): Promise<MenuCategory> {
        try {
            let query = `UPDATE menu_category SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(menuCategory).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE menu_category_id = $${values.length + 1} RETURNING 
                menu_category_id, category_name, description,category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu category: ' + error, 500);
        }
    }
}
