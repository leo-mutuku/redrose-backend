import { injectable } from "inversify";
import { pgClient } from "../../dbConnection";
import { Pool } from "pg";
import { AppError } from "../../utils/AppError";
import { PaymentVoucher } from "../../entities/paymentVoucher/PaymentVoucher";
import { IPaymentVoucherRepository } from "../../interfaces/paymentVoucher/IPaymentVoucherRepository";

@injectable()
export class PaymentVoucherRepository implements IPaymentVoucherRepository {
    private client: Pool;

    constructor() {
        this.client = pgClient();
    }

    // Create a new payment voucher
    async createPaymentVoucher({
        voucher_number,
        amount,
        description,
        payment_date
    }: PaymentVoucher): Promise<PaymentVoucher> {
        try {
            const query = `
                INSERT INTO payment_voucher (voucher_number, amount, description, payment_date)
                VALUES ($1, $2, $3, $4)
                RETURNING payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
            `;
            const values = [voucher_number, amount, description, payment_date];
            const result = await this.client.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error creating payment voucher: ' + error, 500);
        }
    }

    // Get a list of payment vouchers with pagination
    async getPaymentVouchers(limit: number, offset: number): Promise<PaymentVoucher[]> {
        try {
            const query = `
                SELECT payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
                FROM payment_voucher
                LIMIT $1 OFFSET $2
            `;
            const values = [limit, offset];
            const result = await this.client.query(query, values);

            return result.rows;
        } catch (error) {
            throw new AppError('Error fetching payment vouchers: ' + error, 500);
        }
    }

    // Get a single payment voucher by ID
    async getPaymentVoucher(id: number): Promise<PaymentVoucher> {
        try {
            const query = `
                SELECT payment_voucher_id, voucher_number, amount, description, 
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date
                FROM payment_voucher
                WHERE payment_voucher_id = $1
            `;
            const values = [id];
            const result = await this.client.query(query, values);

            if (result.rows.length === 0) {
                throw new AppError('Payment voucher not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error fetching payment voucher: ' + error, 500);
        }
    }

    // Update an existing payment voucher
    async updatePaymentVoucher(id: number, paymentVoucher: Partial<PaymentVoucher>): Promise<PaymentVoucher> {
        try {
            let query = `UPDATE payment_voucher SET `;
            const values: any[] = [];
            let setClauses: string[] = [];

            // Dynamically build the SET clause and values array
            Object.entries(paymentVoucher).forEach(([key, value], index) => {
                setClauses.push(`${key} = $${index + 1}`);
                values.push(value);
            });

            if (setClauses.length === 0) {
                throw new AppError('No fields to update', 400);
            }

            query += setClauses.join(', ');
            query += ` WHERE payment_voucher_id = $${values.length + 1} RETURNING 
                payment_voucher_id, voucher_number, amount, description,
                TO_CHAR(payment_date, 'DD/MM/YYYY') AS payment_date`;

            values.push(id);

            const result = await this.client.query(query, values);
            if (result.rows.length === 0) {
                throw new AppError('Payment voucher not found', 404);
            }

            return result.rows[0];
        } catch (error) {
            throw new AppError('Error updating payment voucher: ' + error, 500);
        }
    }
}
