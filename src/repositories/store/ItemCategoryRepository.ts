import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IItemCategoryRepository } from "../../interfaces/store/IItemCategoryRepository";
import { ItemCategory } from "../../entities/store/ItemCategory";

@injectable()
export class ItemCategoryRepository implements IItemCategoryRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createItemCategory({ category_name, category_description }: ItemCategory): Promise<ItemCategory> {
        try {
            const query = `
                INSERT INTO item_category (category_name, category_description)
                VALUES ($1, $2)
                RETURNING category_id, category_name, category_description, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [category_name, category_description];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating item category: ' + error, 500);
        }
    }

    async getItemCategories(limit: number, offset: number): Promise<ItemCategory[]> {
        try {
            const query = `
                SELECT category_id, category_name, category_description, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM item_category
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching item categories: ' + error, 500);
        }
    }

    async getItemCategory(id: number): Promise<ItemCategory> {
        try {
            const query = `
                SELECT category_id, category_name, category_description, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM item_category
                WHERE category_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Item category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching item category: ' + error, 500);
        }
    }

    async updateItemCategory(id: number, category: Partial<ItemCategory>): Promise<ItemCategory> {
        try {
            let query = `UPDATE item_category SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(category).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE category_id = $${values.length + 1} RETURNING 
                category_id, category_name, category_description, 
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Item category not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating item category: ' + error, 500);
        }
    }
}
