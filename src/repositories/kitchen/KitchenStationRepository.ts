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

    async createKitchenStation({ name, lead_staff_id }: KitchenStation): Promise<KitchenStation> {
        try {
            const query = `
                INSERT INTO station (name, lead_staff_id)
                VALUES ($1, $2)
                RETURNING station_id, name, lead_staff_id,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
            `;
            const values = [name, lead_staff_id];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating kitchen station: ' + error, 500);
        }
    }

    async getKitchenStations(limit: number, offset: number): Promise<KitchenStation[]> {
        try {
            const query = `
               SELECT 
        s.station_id, 
        s.name, 
        s.lead_staff_id, 
        e.first_name || ' ' || e.last_name AS lead_staff,  
        TO_CHAR(s.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
    FROM 
        station AS s 
    INNER JOIN 
        staff AS e 
    ON 
        e.staff_id = s.lead_staff_id
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
            const query = `SELECT 
        s.station_id, 
        s.name, 
        s.lead_staff_id, 
        e.first_name || ' ' || e.last_name AS lead_staff,  
        TO_CHAR(s.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at
    FROM 
        station AS s 
    INNER JOIN 
        staff AS e 
    ON 
        e.staff_id = s.lead_staff_id
    WHERE 
        s.station_id = $1;
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
            let query = `UPDATE station SET `;
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
            query += ` WHERE station_id = $${values.length + 1} RETURNING 
                station_id, name, lead_staff_id,
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
