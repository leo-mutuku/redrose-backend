import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IVoidedBillInteractor } from "../../interfaces/sales/IVoidedBillInteractor";
import { IVoidedBillRepository } from "../../interfaces/sales/IVoidedBillRepository";

@injectable()
export class VoidedBillInteractor implements IVoidedBillInteractor {
    private repository: IVoidedBillRepository;

    constructor(@inject(INTERFACE_TYPE.VoidedBillRepository) repository: IVoidedBillRepository) {
        this.repository = repository;
    }

    async createVoidedBill(input: any): Promise<any> {
        try {
            const result = await this.repository.createVoidedBill(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create voided bill. Please try again later.');
        }
    }

    async getVoidedBill(id: number): Promise<any> {
        try {
            const result = await this.repository.getVoidedBill(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve voided bill with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in VoidedBillInteractor. Please try again later.');
        }
    }

    async updateVoidedBill(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateVoidedBill(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating voided bill in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update voided bill. Please try again later.');
        }
    }

    async getVoidedBills(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getVoidedBills(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching voided bills in VoidedBillInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve voided bills. Please try again later.');
        }
    }
}
