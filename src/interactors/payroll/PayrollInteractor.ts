import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPayrollInteractor } from "../../interfaces/payroll/IPayrollInteractor";
import { IPayrollRepository } from "../../interfaces/payroll/IPayrollRepository";

@injectable()
export class PayrollInteractor implements IPayrollInteractor {
    private repository: IPayrollRepository;

    constructor(@inject(INTERFACE_TYPE.PayrollRepository) repository: IPayrollRepository) {
        this.repository = repository;
    }

    async createPayroll(input: any): Promise<any> {
        try {
            const result = await this.repository.createPayroll(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in PayrollInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create payroll. Please try again later.');
        }
    }

    async getPayroll(id: number): Promise<any> {
        try {
            const result = await this.repository.getPayroll(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve payroll with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PayrollInteractor. Please try again later.');
        }
    }

    async updatePayroll(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePayroll(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating payroll in PayrollInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update payroll. Please try again later.');
        }
    }

    async getPayrolls(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPayrolls(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching payrolls in PayrollInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve payrolls. Please try again later.');
        }
    }
}
