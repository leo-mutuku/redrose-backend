import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { KitchenStation } from "../../entities/kitchen/KitchenStation";
import { IKitchenStationRepository } from "../../interfaces/kitchen/IKitchenStationRepository";

@injectable()
export class KitchenStationRepository implements IKitchenStationRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    async createKitchenStation({ station_name, description }: KitchenStation): Promise<KitchenStation> {
        try {
            const query = `
                INSERT INTO kitchen_station (station_name, description)
                VALUES ($1, $2)
                RETURNING kitchen_station_id, station_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [station_name, description];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating kitchen station: ' + error, 500);
        }
    }

    async getKitchenStations(limit: number, offset: number): Promise<KitchenStation[]> {
        try {
            const query = `
                SELECT kitchen_station_id, station_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_station
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching kitchen stations: ' + error, 500);
        }
    }

    async getKitchenStation(id: number): Promise<KitchenStation> {
        try {
            const query = `
                SELECT kitchen_station_id, station_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
                FROM kitchen_station
                WHERE kitchen_station_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Kitchen station not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching kitchen station: ' + error, 500);
        }
    }

    async updateKitchenStation(id: number, kitchenStation: Partial<KitchenStation>): Promise<KitchenStation> {
        try {
            let query = `UPDATE kitchen_station SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(kitchenStation).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE kitchen_station_id = $${values.length + 1} RETURNING 
                kitchen_station_id, station_name, description,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Kitchen station not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating kitchen station: ' + error, 500);
        }
    }
}
