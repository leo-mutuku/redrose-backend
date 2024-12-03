import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IDeductionInteractor } from "../../interfaces/payroll/IDeductionInteractor";
import { IDeductionRepository } from "../../interfaces/payroll/IDeductionRepository";

@injectable()
export class DeductionInteractor implements IDeductionInteractor {
    private repository: IDeductionRepository;

    constructor(@inject(INTERFACE_TYPE.DeductionRepository) repository: IDeductionRepository) {
        this.repository = repository;
    }

    async createDeduction(input: any): Promise<any> {
        try {
            const result = await this.repository.createDeduction(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in DeductionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create deduction. Please try again later.');
        }
    }

    async getDeduction(id: number): Promise<any> {
        try {
            const result = await this.repository.getDeduction(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve deduction with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in DeductionInteractor. Please try again later.');
        }
    }

    async updateDeduction(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateDeduction(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating deduction in DeductionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update deduction. Please try again later.');
        }
    }

    async getDeductions(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getDeductions(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching deductions in DeductionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve deductions. Please try again later.');
        }
    }
}
