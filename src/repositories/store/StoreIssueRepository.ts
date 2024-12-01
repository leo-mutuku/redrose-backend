import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { StoreIssue } from "../../entities/store/StoreIssue";
import { IStoreIssueRepository } from "../../interfaces/store/IStoreIssueRepository";

@injectable()
export class StoreIssueRepository implements IStoreIssueRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new store issue
    async createStoreIssue({
        issue_date,
        description,
        issued_by,
        created_by,
        isssue_list,
    }: StoreIssue): Promise<StoreIssue> {
        try {
            // Check if issue list is not empty
            if (!isssue_list || isssue_list.length === 0) {
                throw new AppError("Issue list must not be empty", 400);
            }

            // Insert into store_issue_header
            const query = `
                INSERT INTO store_issue_header (issue_date, description, issued_by, created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING store_issue_header_id, issue_date, description, issued_by, created_by;
            `;
            const values = [issue_date, description, issued_by, created_by];
            const result = await this.client.query(query, values);
            const header_id = result.rows[0].store_issue_header_id;

            // Process each item in the issue list
            for (const item of isssue_list) {
                // Step 1: Fetch the current quantity for `store_item_id`
                const fetchQuantityQuery = `
                    SELECT quantity 
                    FROM store_item 
                    WHERE store_item_id = $1 
                    FOR UPDATE;
                `;
                const fetchResult = await this.client.query(fetchQuantityQuery, [item.store_item_id]);
                const initialQuantity = fetchResult.rows[0]?.quantity;

                if (initialQuantity === undefined || initialQuantity < item.issue_quantity) {
                    throw new AppError(
                        `Insufficient quantity for store_item_id: ${item.store_item_id}`,
                        400
                    );
                }

                // Step 2: Update the quantity in store_item
                const updateQuery = `
                    UPDATE store_item 
                    SET quantity = quantity - $1 
                    WHERE store_item_id = $2 
                    RETURNING quantity;
                `;
                const updateResult = await this.client.query(updateQuery, [
                    item.issue_quantity,
                    item.store_item_id,
                ]);
                const finalQuantity = updateResult.rows[0].quantity;

                // Step 3: Insert into store_issue_line
                const lineInsertQuery = `
                    INSERT INTO store_issue_line 
                    (store_issue_header_id, store_item_id, issue_quantity, initial_value, final_value)
                    VALUES ($1, $2, $3, $4, $5);
                `;
                const lineValues = [
                    header_id,
                    item.store_item_id,
                    item.issue_quantity,
                    initialQuantity,
                    finalQuantity,
                ];
                await this.client.query(lineInsertQuery, lineValues);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating store issue: ' + error, 500);
        }
    }


    // Get all store issues with pagination
    async getStoreIssues(limit: number, offset: number): Promise<StoreIssue[]> {
        try {
            const query = `
                SELECT 
    sih.*, 
    json_agg(sil) AS issue_lines
FROM 
    store_issue_header sih
LEFT JOIN 
    store_issue_line sil 
    ON sih.store_issue_header_id = sil.store_issue_header_id

GROUP BY
    sih.store_issue_header_id
limit $1 offset $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching store issues: ' + error, 500);
        }
    }

    // Get a specific store issue by ID
    async getStoreIssue(id: number): Promise<StoreIssue> {
        try {
            const query = `
                SELECT 
    sih.*, 
    json_agg(sil) AS issue_lines
FROM 
    store_issue_header sih
LEFT JOIN 
    store_issue_line sil 
    ON sih.store_issue_header_id = sil.store_issue_header_id
WHERE 
    sih.store_issue_header_id = $1
GROUP BY
    sih.store_issue_header_id;
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Store issue not found', 404);
            }

            // get isse_list

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching store issue: ' + error, 500);
        }
    }

    // Update a store issue by its ID
    async updateStoreIssue(id: number, issue: Partial<StoreIssue>): Promise<StoreIssue> {
        try {
            let query = `UPDATE store_issue SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(issue).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE issue_id = $${values.length + 1} 
                RETURNING 
                    issue_id,
                    store_id,
                    item_id,
                    quantity_issued,
                    issued_by,
                    issued_to,
                    TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at,
                    (SELECT item_name FROM item_register WHERE item_id = store_issue.item_id) AS item_name,
                    (SELECT store_name FROM store_register WHERE store_id = store_issue.store_id) AS store_name;
            `;
            values.push(id);

            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Store issue not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating store issue: ' + error, 500);
        }
    }
}
