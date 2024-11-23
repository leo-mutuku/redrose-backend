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
    getRoles(limit: number, offset: number): Promise<Role> {
        throw new Error("Method not implemented.");
    }
    async updateRole(id: number, role: Role): Promise<Role> {
        try {
            const query =
                `UPDATE roles SET role_name = $1, role_description = $2 WHERE role_id = $3
              RETURNING *`
            const values = [role.role_name, role.role_description, id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while updating role: " + error, 400)

        }
    }

}