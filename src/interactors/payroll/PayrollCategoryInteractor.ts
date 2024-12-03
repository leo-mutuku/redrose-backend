import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPayrollCategoryInteractor } from "../../interfaces/payroll/IPayrollCategoryInteractor";
import { IPayrollCategoryRepository } from "../../interfaces/payroll/IPayrollCategoryRepository";

@injectable()
export class PayrollCategoryInteractor implements IPayrollCategoryInteractor {
    private repository: IPayrollCategoryRepository;

    constructor(@inject(INTERFACE_TYPE.PayrollCategoryRepository) repository: IPayrollCategoryRepository) {
        this.repository = repository;
    }

    async createPayrollCategory(input: any): Promise<any> {
        try {
            const result = await this.repository.createPayrollCategory(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create payroll category. Please try again later.');
        }
    }

    async getPayrollCategory(id: number): Promise<any> {
        try {
            const result = await this.repository.getPayrollCategory(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve payroll category with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PayrollCategoryInteractor. Please try again later.');
        }
    }

    async updatePayrollCategory(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePayrollCategory(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating payroll category in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update payroll category. Please try again later.');
        }
    }

    async getPayrollCategories(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPayrollCategories(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching payroll categories in PayrollCategoryInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve payroll categories. Please try again later.');
        }
    }
}
