import { UserRole } from "../../entities/administration/UserRoles";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IUserRoleRepository } from "../../interfaces/administation/IUserRoleRepository";
import { User } from "../../entities/administration/Users";

@injectable()
export class UserRoleRepository implements IUserRoleRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async assignUserRoles(id: number, roles: number[]): Promise<any> {
        try {

            const user = await this.client.query(
                `SELECT role_id FROM user_roles WHERE user_id = $1`,
                [id]
            );
            const role_ids: number[] = user.rows.map((role: any) => role.role_id);
            const new_ids: number[] = roles?.filter((role: number) => !role_ids.includes(role));

            if (!new_ids?.length) {
                console.log("User already has these roles");
                throw new AppError("User already has these roles", 400);
            }

            for (let role of new_ids) {
                const query = `INSERT INTO user_roles(role_id, user_id) VALUES($1, $2) RETURNING *`;
                const values = [role, id];
                await this.client.query(query, values);
            }

            // Combine existing and new role IDs

            return { roles: [...role_ids, ...new_ids] };

        } catch (error) {
            throw new AppError("Error while creating user role: " + error, 400)

        }
    }
    async updateUserRole(id: number, userRole: UserRole): Promise<any> {
        try {
            const query =
                `UPDATE user_roles SET role_id = $1, user_id = $2 WHERE user_role_id = $3
              RETURNING *`
            const values = [userRole.role_id, userRole.user_id, id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while updating shift: " + error, 400)

        }
    }
    async getUserRole(id: number): Promise<any> {
        try {
            let query = `SELECT * FROM user_roles WHERE user_role_id = $1`
            let values = [id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting shift: " + error, 400)

        }
    }
    async unassignRoles(id: number, roles: number[]): Promise<any> {
        try {

            const user = await this.client.query(
                `SELECT role_id FROM user_roles WHERE user_id = $1`,
                [id]
            );
            const role_ids: number[] = user.rows.map((role: any) => role.role_id);
            console.log(role_ids, "role ids");
            const new_ids: number[] = roles?.filter((role: number) => role_ids.includes(role));
            console.log(new_ids, "new ids");


            if (!new_ids?.length) {
                console.log("");
                throw new AppError("User is not current assigned of of the roles(s)", 400);
            }

            for (let role of new_ids) {
                const query = `Delete FROM user_roles WHERE role_id = $1 AND user_id = $2 RETURNING *`;
                const values = [role, id];
                await this.client.query(query, values);
            }

            // Combine existing and new role IDs

            return { roles: [new_ids] };


        } catch (error) {
            throw new AppError("Error while unassiging user role: " + error, 400)

        }
    }

    async getRole(id: number): Promise<UserRole> {
        try {
            let query = `SELECT * FROM shifts WHERE shift_id = $1`
            let values = [id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting shift: " + error, 400)

        }
    }
    async getRoles(limit: number, offset: number): Promise<User> {
        try {
            let query = `SELECT * FROM shifts LIMIT $1 OFFSET $2`
            let values = [limit, offset]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while getting shift: " + error, 400)

        }
    }



}   