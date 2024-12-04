import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";

@injectable()
export class SalesOrderClearingInteractor implements SalesOrderClearingInteractor {
    private repository: ISalesOrderClearingRepository;

    constructor(@inject(INTERFACE_TYPE.SalesOrderClearingRepository) repository: ISalesOrderClearingRepository) {
        this.repository = repository;
    }

    async createSalesOrderClearing(input: any): Promise<any> {
        try {
            const result = await this.repository.createSalesOrderClearing(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in SalesOrderClearingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create sales order clearing. Please try again later.');
        }
    }

    async getSalesOrderClearing(id: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrderClearing(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve sales order clearing with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in SalesOrderClearingInteractor. Please try again later.');
        }
    }

    async updateSalesOrderClearing(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateSalesOrderClearing(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating sales order clearing in SalesOrderClearingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update sales order clearing. Please try again later.');
        }
    }

    async getSalesOrderClearings(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrderClearings(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching sales order clearings in SalesOrderClearingInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve sales order clearings. Please try again later.');
        }
    }
}
