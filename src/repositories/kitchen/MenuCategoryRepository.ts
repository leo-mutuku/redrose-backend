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
                 SELECT 
    mc.menu_category_id, 
    mc.category_name, 
    mc.description, 
    mc.category_abbr,
    TO_CHAR(mc.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSONB_BUILD_OBJECT(
                'menu_item_id', mi.menu_item_id,
                'item_name', mr.name,
                'price', mi.price
            )
        ) FILTER (WHERE mi.menu_item_id IS NOT NULL), 
        '[]'
    ) AS menu_items
FROM 
    menu_category mc
LEFT JOIN 
    menu_item mi 
ON 
    mc.menu_category_id = mi.menu_category_id
LEFT JOIN 
    menu_register mr
ON 
    mi.menu_register_id = mr.menu_register_id
GROUP BY 
    mc.menu_category_id
            `;

            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching menu categories: ' + error, 500);
        }
    }


    async getMenuCategory(id: number): Promise<MenuCategory> {
        try {
            const query = `
           SELECT 
    mc.menu_category_id, 
    mc.category_name, 
    mc.description, 
    mc.category_abbr,
    TO_CHAR(mc.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
    COALESCE(
        JSON_AGG(
            JSONB_BUILD_OBJECT(
                'menu_item_id', mi.menu_item_id,
                'item_name', mr.name,
                'price', mi.price
            )
        ) FILTER (WHERE mi.menu_item_id IS NOT NULL), 
        '[]'
    ) AS menu_items
FROM 
    menu_category mc
LEFT JOIN 
    menu_item mi 
ON 
    mc.menu_category_id = mi.menu_category_id
LEFT JOIN 
    menu_register mr
ON 
    mi.menu_register_id = mr.menu_register_id
GROUP BY 
    mc.menu_category_id
                WHERE mc.menu_category_id = $1
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
            // Define allowed fields for updates
            const allowedFields = ["category_name", "description", "category_abbr"]; // Replace with actual fields

            // Fetch the existing menu category record
            const existingRecordResult = await this.client.query('SELECT * FROM menu_category WHERE menu_category_id = $1', [id]);
            if (existingRecordResult.rows.length === 0) {
                throw new AppError(`Menu category with id ${id} not found`, 404);
            }

            const existingRecord = existingRecordResult.rows[0];

            // Filter fields that are both allowed and have changed
            const fieldsToUpdate = Object.keys(menuCategory).filter(
                (field) => allowedFields.includes(field) && menuCategory[field] !== existingRecord[field]
            );

            // If no fields are allowed or changed, return the existing record
            if (fieldsToUpdate.length === 0) {
                return existingRecord;
            }

            // Construct the dynamic query
            const setClauses = fieldsToUpdate.map((field, index) => `${field} = $${index + 1}`);
            const query = `UPDATE menu_category SET ${setClauses.join(', ')} WHERE menu_category_id = $${fieldsToUpdate.length + 1} RETURNING 
                menu_category_id, category_name, description, category_abbr,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            // Prepare the values array
            const values = [...fieldsToUpdate.map((field) => menuCategory[field]), id];

            // Execute the query
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Menu category not found', 404);
            }

            // Return the updated record
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating menu category: ' + error, 500);
        }
    }

}
