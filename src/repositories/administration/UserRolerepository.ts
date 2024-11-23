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
    createUserRole(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async createuserRole(userRole: UserRole): Promise<UserRole> {
        try {
            const query =
                `INSERT INTO user_roles(role_id, user_id) VALUES($1, $2)
          RETURNING *`
            const values = [userRole.role_id, userRole.user_id]
            const result = await this.client.query(query, values)
            return result.rows[0]

        } catch (error) {
            throw new AppError("Error while creating shift: " + error, 400)

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
    async getUserRoles(limit: number, offset: number): Promise<any> {
        try {

        } catch (error) {

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