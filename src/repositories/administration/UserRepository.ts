import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";

import { IUserRepository } from "../../interfaces/administation/IUserRepository"
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import bcrypt from "bcrypt";
import { User } from "../../entities/administration/Users";

@injectable()
export class UserRepository implements IUserRepository {

    private client: Pool
    constructor() {
        this.client = pgClient()
    }
    async createUser({ username, first_name, last_name, password, ttl, phone }: User): Promise<User> {
        try {
            const saltRounds = 10; // Number of hashing rounds
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `INSERT INTO users (username, first_name, last_name, password, ttl, phone)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING 
            user_id, username, first_name, last_name, created_by, 
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users `;
            const values = [username, first_name, last_name, hashedPassword, ttl, phone];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating user ' + error)
        }
    }


    async getUsers(limit: number, offset: number): Promise<User[]> {
        try {
            const query = `SELECT user_id, username, first_name, last_name, created_by, 
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users WHERE is_active = true LIMIT $1 OFFSET $2`;
            const values = [limit, offset];
            const result = await this.client.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching users ' + error)
        }

    }
    async getUser(id: number): Promise<User> {
        try {


            const query = `SELECT  user_id, username, first_name, last_name, created_by,  is_active,
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at FROM users  WHERE user_id = $1`;
            const values = [id];

            const result = await this.client.query(query, values);
            console.log(result.rows[0])
            return result.rows[0];

        } catch (error) {
            throw new AppError('Error fetching user ' + error)
        }

    }
    async updateUser(id: number, user: User): Promise<User> {
        try {
            const query = `UPDATE users SET first_name = $1, last_name = $2, phone = $3, is_active=$4 WHERE user_id = $5 RETURNING 
            user_id, username, first_name, last_name, created_by,  is_active,
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;
            const values = [user.first_name, user.last_name, user.phone, user.is_active, id];
            const result = await this.client.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error updating user ' + error)
        }
    }

}