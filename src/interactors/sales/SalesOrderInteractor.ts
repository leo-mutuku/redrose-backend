import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { ISalesOrderInteractor } from "../../interfaces/sales/ISalesOrderInteractor";
import { ISalesOrderRepository } from "../../interfaces/sales/ISalesOrderRepository";

@injectable()
export class SalesOrderInteractor implements ISalesOrderInteractor {
    private repository: ISalesOrderRepository;

    constructor(@inject(INTERFACE_TYPE.SalesOrderRepository) repository: ISalesOrderRepository) {
        this.repository = repository;
    }

    async createSalesOrder(input: any): Promise<any> {
        try {
            // Perform any necessary business logic or validation here
            const result = await this.repository.createSalesOrder(input);



            // print the result for debugging purposes  - to fail silently with sms notification
            console.log('ptint', result);
            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create sales order. Please try again later.');
        }
    }

    async getSalesOrder(id: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrder(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in SalesOrderInteractor. Please try again later.');
        }
    }


    async updateSalesOrder(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateSalesOrder(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(` ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update sales order. Please try again later.');
        }
    }

    async getSalesOrders(search: number, status: string, limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrders(search, status, limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching sales orders in SalesOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve sales orders. Please try again later.');
        }
    }
    async authWaiter(pin: number, staff_id: number): Promise<any> {
        try {
            const result = await this.repository.authWaiter(pin, staff_id);
            return result;
        } catch (error) {
            // if (error instanceof AppError) {
            throw new AppError(`Error fetching sales orders in SalesOrderInteractor: ${error}`, 500);
        }
        throw new Error('Failed to retrieve sales orders. Please try again later.');
    }
}

