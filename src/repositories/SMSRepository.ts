import { Pool } from "pg";
import { ISMSRepository } from "../interfaces/ISMSRepository";
import { pgClient } from "../dbConnection";
import { injectable } from "inversify";
import { AppError } from "../utils/AppError";

@injectable()
export class SMSRepository implements ISMSRepository {

    private client: Pool;
    constructor() {
        this.client = pgClient();
    }
    async getPhoneNumbers(target: any[]): Promise<string[]> {
        try {
            const phoneNumbers: string[] = [];

            // Helper function to fetch phone numbers from a table.
            const fetchPhoneNumbers = async (tableName: string): Promise<string[]> => {
                const query = `
                SELECT phone 
                FROM ${tableName} 
                WHERE phone IS NOT NULL 
                  AND LENGTH(phone) = 10 
                  AND phone ~ '^[0-9]+$'
            `;
                const result = await this.client.query(query); // Use your database client here.
                return result.rows.map((row: { phone: string }) => row.phone);
            };

            // Fetch phone numbers based on the target array.
            for (const table of target) {
                if (["suppliers", "vendors", "staff"].includes(table)) {
                    const tablePhoneNumbers = await fetchPhoneNumbers(table);
                    phoneNumbers.push(...tablePhoneNumbers);
                } else {
                    console.warn(`Table ${table} is not supported.`);
                    throw new Error(`Table ${table} is not supported.`)
                }
            }

            return phoneNumbers;
        } catch (error) {
            throw new AppError("Failed to get phone numbers" + error, 500);

        }
    }

}