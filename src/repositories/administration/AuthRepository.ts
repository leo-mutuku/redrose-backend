import { injectable } from "inversify";
import { Auth } from "../../entities/administration/Auth";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";
import { AppError } from "../../utils/AppError";


@injectable()
export class AuthRepository implements IAuthRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async login({ username }: Auth): Promise<Auth> {
        try {
            const query = "SELECT user_id, username, first_name, last_name, created_by,password, TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users WHERE username = $1";
            const values = [username];
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                // Throw operational error for invalid login
                throw new AppError("Invalid username or password", 401);
            }

            // Return get user roles
            const user = result.rows[0];
            const query2 = "SELECT role_id FROM user_roles WHERE user_id = $1";
            const values2 = [user.user_id];
            const result2 = await this.client.query(query2, values2);
            const roles = result2.rows.map((row: any) => row.role_id);
            console.log(roles)
            return { ...result.rows[0], roles };
        } catch (error) {
            // Re-throw unexpected errors with context
            if (error instanceof AppError) {
                throw error; // Re-throw operational AppErrors to be handled by middleware
            }

            // Wrap and propagate unexpected errors
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new AppError(
                `Error occurred during login: ${errorMessage}`,
                500,
                false // Mark as non-operational if it's an unexpected error
            );
        }
    }
    async forgotPassword(username: string): Promise<Auth> {
        try {
            const query = "SELECT user_id, username, first_name, last_name, created_by, TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users  FROM users WHERE user_name = $1";
            const values = [username];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error logging in" + error);

        }
    }
    async resetPassword({ username, password }: Auth): Promise<Auth> {
        try {
            const query = "UPDATE users SET password = $1 WHERE user_name = $2";
            const values = [username, password];
            const result = await this.client.query(query, values);
            return result.rows[0];

        } catch (error) {
            throw new Error("Error logging in" + error);

        }
    }

}
