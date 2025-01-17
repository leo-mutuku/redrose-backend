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
    async createUser({ username, password, staff_id, roles }: User): Promise<any> {
        try {
            const saltRounds = 10; // Number of hashing rounds
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const query = `INSERT INTO users (username, password, staff_id)
             VALUES ($1, $2, $3) RETURNING *  `;

            const values = [username, hashedPassword, staff_id];
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

            // get phone number from staff table
            const staffQuery = `SELECT phone FROM staff WHERE staff_id = $1`;
            const staffValues = [parseInt(result.rows[0].staff_id)];
            const staffResult = await this.client.query(staffQuery, staffValues);
            const phone = staffResult.rows[0].phone;

            return { ...result.rows[0], roles, password, phone };
        } catch (error) {
            throw new AppError('Error creating user ' + error)
        }
    }

    async getUsers(limit: number, offset: number): Promise<User[]> {
        try {
            const query =
                `SELECT u.user_id, u.username, s.first_name, s.last_name, s.first_name as created_by, 
            TO_CHAR(u.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at 
            FROM users  as u
            inner join staff as s  on s.staff_id = u.staff_id
            WHERE u.is_active = true LIMIT $1 OFFSET $2`;
            const values = [limit, offset];
            const result = await this.client.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching users ' + error)
        }

    }
    async getUser(id: number): Promise<User> {
        try {


            const query =
                `SELECT  u.user_id, u.username, u.username as email, s.phone, s.first_name, s.last_name , u.is_active, u.created_by,
            TO_CHAR(u.created_at, 'DD/MM/YYYY : HH12:MI AM') AS created_at 
            FROM users as u
            inner join staff as s on s.staff_id = u.staff_id
             WHERE u.user_id = $1`;
            const values = [id];

            const result = await this.client.query(query, values);
            const roles = await this.client.query(`SELECT role_id  FROM user_roles WHERE user_id = $1`, [id]);
            const user_roles = roles.rows.map((row: any) => row.role_id);

            let role_array: any[] = [];
            for (let role of user_roles) {
                const role_name_result = await this.client.query(
                    `SELECT role_name, role_id FROM roles WHERE role_id = $1`,
                    [role]
                );

                // Check if the query returned a result
                if (role_name_result.rows.length > 0) {
                    const name: string = role_name_result.rows[0].role_name;
                    const id: number = role_name_result.rows[0].role_id;
                    role_array.push({ name, id });
                    console.log(role_array);
                } else {
                    console.warn(`Role with role_id ${role} does not exist.`);

                }
            }

            return { ...result.rows[0], roles: role_array };
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



    async changePassword({ user_id, password, old_password }: User): Promise<any> {
        try {
            // Ensure old_password is defined
            if (!old_password) {
                throw new AppError('Old password is required', 400); // Handle missing old password
            }

            // Step 1: Retrieve the current password from the database
            const getPasswordQuery = `SELECT password FROM users WHERE user_id = $1`;
            const getUserParams = [user_id];
            const res = await this.client.query(getPasswordQuery, getUserParams);

            if (res.rows.length === 0) {
                throw new AppError('User not found', 404);  // Handle user not found
            }

            const current_password = res.rows[0].password;


            // Step 2: Compare old_password with the stored hashed password using bcrypt
            const isOldPasswordValid = await bcrypt.compare(old_password, current_password);

            if (!isOldPasswordValid) {
                throw new AppError('Old password is incorrect', 400);  // Handle invalid old password
            }
            if (!password) {
                throw new AppError("password not provided!", 400)
            }
            // Step 3: Hash the new password
            const saltRounds = 10; // Number of hashing rounds
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Step 4: Update the password in the database
            const updatePasswordQuery = `
                UPDATE users SET password = $1 WHERE user_id = $2
            `;
            const updateValues = [hashedPassword, user_id];
            const updateResult = await this.client.query(updatePasswordQuery, updateValues);

            // Check if update was successful
            if (updateResult.rowCount === 0) {
                throw new AppError('Password update failed', 500);  // Handle update failure
            }

            // Return a success message or other relevant response
            return { message: 'Password updated successfully' };
        } catch (error) {
            throw new AppError('Error: ' + error, 400);
        }
    }


}