import { Role } from "../../entities/administration/Roles";
import { IRoleRepository } from "../../interfaces/administation/IRoleRepository";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";
import { injectable } from "inversify";
import { AppError } from "../../utils/AppError";

@injectable()
export class RoleRepository implements IRoleRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }

    async createRole(role: Role): Promise<Role> {
        try {

            const query =
                `INSERT INTO roles(role_name,role_description, created_by)
                 VALUES($1, $2, $3)
              RETURNING *`
            const values = [role.role_name, role.role_description, role.created_by]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while cteating role: " + error, 400)

        }
    }
    async getRole(role_id: number): Promise<Role> {
        try {
            const query =
                `SELECT * FROM roles WHERE role_id = $1`
            const values = [role_id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting role: " + error, 400)
        }

    }
    async getRoles(limit: number, offset: number): Promise<Role[]> {
        try {
            const query =
                `SELECT * FROM roles LIMIT $1 OFFSET $2`
            const values = [limit, offset]
            const result = await this.client.query(query, values)
            return result.rows
        } catch (error) {
            throw new AppError("Error while getting roles: " + error, 400)

        }
    }
    async updateRole(id: number, role: Role): Promise<Role> {
        try {
            // Fetch the existing record
            const existingQuery = `SELECT role_name, role_description FROM roles WHERE role_id = $1`;
            const existingResult = await this.client.query(existingQuery, [id]);

            if (existingResult.rows.length === 0) {
                throw new Error(`Role with ID ${id} not found`);
            }

            const existingRole = existingResult.rows[0];

            // Check if any changes are detected
            const isNameChanged = existingRole.role_name !== role.role_name;
            const isDescriptionChanged = existingRole.role_description !== role.role_description;

            if (!isNameChanged && !isDescriptionChanged) {
                throw new AppError("No changes detected, update skipped.", 400);
            }

            // Update only the fields that changed
            const updateQuery = `
                UPDATE roles SET 
                    role_name = COALESCE($1, role_name),
                    role_description = COALESCE($2, role_description)
                WHERE role_id = $3
                RETURNING *`;
            const values = [
                isNameChanged ? role.role_name : null, // Update if changed, else retain existing
                isDescriptionChanged ? role.role_description : null,
                id
            ];
            const updateResult = await this.client.query(updateQuery, values);

            return updateResult.rows[0];
        } catch (error) {
            throw new AppError("Error while updating role: " + error, 400)

        }
    }

}