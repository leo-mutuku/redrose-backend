import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { User } from "../../entities/administration/Users";
import { IUserRepository } from "../../interfaces/administation/IUserRepository"
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";

@injectable()
export class UserRepository implements IUserRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createUser({ username, first_name, last_name, password, ttl, phone }: User): Promise<User> {
        try {
            const query = `INSERT INTO users (username, first_name, last_name, password, ttl, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            const values = [username, first_name, last_name, password, ttl, phone];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating user ' + error)
        }
    }


    async getUsers(limit: number, offset: number): Promise<User[]> {
        try {
            const query = `SELECT * FROM users LIMIT $1 OFFSET $2`;
            const values = [limit, offset];
            const result = await this.client.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching users ' + error)
        }

    }
    async getUser(id: number): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE user_id = $1`;
            const values = [id];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching user ' + error)
        }

    }
    async updateUser(id: number, user: User): Promise<User> {
        try {
            const query = `UPDATE users SET username = $1, password = $2, ttl = $3, phone = $4 WHERE user_id = $5 RETURNING *`;
            const values = [user.username, user.password, user.ttl, user.phone, id];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error updating user ' + error)
        }
    }

}