import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPaymentVoucherInteractor } from "../../interfaces/payment/IPaymentVoucherInteractor";
import { IPaymentVoucherRepository } from "../../interfaces/payment/IPaymentVoucherRepository";

@injectable()
export class PaymentVoucherInteractor implements IPaymentVoucherInteractor {
    private repository: IPaymentVoucherRepository;

    constructor(@inject(INTERFACE_TYPE.PaymentVoucherRepository) repository: IPaymentVoucherRepository) {
        this.repository = repository;
    }

    async createPaymentVoucher(input: any): Promise<any> {
        try {
            const result = await this.repository.createPaymentVoucher(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in PaymentVoucherInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create payment voucher. Please try again later.');
        }
    }

    async getPaymentVoucher(id: number): Promise<any> {
        try {
            const result = await this.repository.getPaymentVoucher(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve payment voucher with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PaymentVoucherInteractor. Please try again later.');
        }
    }

    async updatePaymentVoucher(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePaymentVoucher(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating payment voucher in PaymentVoucherInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update payment voucher. Please try again later.');
        }
    }

    async getPaymentVouchers(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPaymentVouchers(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching payment vouchers in PaymentVoucherInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve payment vouchers. Please try again later.');
        }
    }
}
