import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPayrollSetupInteractor } from "../../interfaces/payroll/IPayrollSetupInteractor";
import { IPayrollSetupRepository } from "../../interfaces/payroll/IPayrollSetupRepository";

@injectable()
export class PayrollSetupInteractor implements IPayrollSetupInteractor {
    private repository: IPayrollSetupRepository;

    constructor(@inject(INTERFACE_TYPE.PayrollSetupRepository) repository: IPayrollSetupRepository) {
        this.repository = repository;
    }

    async createPayrollSetup(input: any): Promise<any> {
        try {
            const result = await this.repository.createPayrollSetup(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in PayrollSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create payroll setup. Please try again later.');
        }
    }

    async getPayrollSetup(id: number): Promise<any> {
        try {
            const result = await this.repository.getPayrollSetup(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve payroll setup with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PayrollSetupInteractor. Please try again later.');
        }
    }

    async updatePayrollSetup(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePayrollSetup(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating payroll setup in PayrollSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update payroll setup. Please try again later.');
        }
    }

    async getPayrollSetups(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPayrollSetups(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching payroll setups in PayrollSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve payroll setups. Please try again later.');
        }
    }
}
