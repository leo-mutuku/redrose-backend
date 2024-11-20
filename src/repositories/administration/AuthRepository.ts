import { injectable } from "inversify";
import { Auth } from "../../entities/administration/Auth";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";
import { Pool } from "pg";
import { pgClient } from "../../dbConnection";

@injectable()
export class AuthRepository implements IAuthRepository {
    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async login({ username, password }: Auth): Promise<Auth> {
        try {
            const query = "SELECT * FROM users WHERE user_name = $1 AND password = $2";
            const values = [username, password];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error("Error logging in" + error);
        }
    }
    async forgotPassword(username: string): Promise<Auth> {
        try {
            const query = "SELECT * FROM users WHERE user_name = $1";
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
