import { UserRole } from "../../entities/administration/UserRoles";
import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { IUserRoleRepository } from "../../interfaces/administation/IUserRoleRepository";

@injectable()
export class UserRoleRepository implements IUserRoleRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
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
    async updateUserRole(id: number, input: any): Promise<any> {
        try {

        } catch (error) {

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

    async getRole(username: string): Promise<Shift> {
        try {

        } catch (error) {
            throw new AppError("Error while getting shift: " + error, 400)

        }
    }
    async getRoles(shift: Shift): Promise<Shift> {
        try {

        } catch (error) {
            throw new AppError("Error while getting shift: " + error, 400)

        }
    }
    updateRole(id: number, shift: Shift): Promise<Shift> {
        try {

        } catch (error) {
            throw new AppError("Error while updating shift: " + error, 400)

        }
    }

}   