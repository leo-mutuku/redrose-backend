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
    async createUser({ username, first_name, last_name, password, ttl, phone, roles }: User): Promise<User> {
        try {
            const saltRounds = 10; // Number of hashing rounds
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `INSERT INTO users (username, first_name, last_name, password, ttl, phone)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING 
            user_id, username, first_name, last_name, created_by, 
            TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at  `;

            const values = [username, first_name, last_name, hashedPassword, ttl, phone];
            const result = await this.client.query(query, values);
            // create user roles
            const user_id = parseInt(result.rows[0].user_id)
            for (let role of roles ?? []) {
                try {
                    const query2 = `
                        INSERT INTO user_roles (user_id, role_id) 
                        VALUES ($1, $2)
                        RETURNING user_id, role_id;
                    `;
                    const values2 = [user_id, role];
                    const result2 = await this.client.query(query2, values2);

                } catch (error) {
                    throw new AppError('Error creating user role ' + error, 500);
                }
            }

            return { ...result.rows[0], roles };
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
            return result.rows[0];

        } catch (error) {
            throw new AppError('Error fetching user ' + error)
        }

    }
    async updateUser(id: number, user: User): Promise<User> {
        try {
            // Initialize query parts
            let query = `UPDATE users SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Prevent updating user_id
            if ('user_id' in user) {
                throw new AppError('Updating user_id is not allowed');
            }

            // Dynamically build the SET clause and values array
            Object.entries(user).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            // update roles  check if role exist in user_roles table


            // Ensure at least one field to update
            if (setClauses.length === 0) {
                throw new Error('No fields to update');
            }

            // Add WHERE clause and RETURNING statement
            query += setClauses.join(', ');
            query += ` WHERE user_id = $${values.length + 1} RETURNING 
                user_id, username, first_name, last_name, created_by, is_active,
                TO_CHAR(created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at`;

            // Add user ID to the values array
            values.push(id);

            // Execute the query
            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('User not found', 400);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating user ' + error, 400)
        }
    }

}