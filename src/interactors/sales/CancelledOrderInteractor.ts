import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { ICancelledOrderInteractor } from "../../interfaces/sales/ICancelledOrderInteractor";
import { ICancelledOrderRepository } from "../../interfaces/sales/ICancelledOrderRepository";


@injectable()
export class CancelledOrderInteractor implements ICancelledOrderInteractor {
    private repository: ICancelledOrderRepository;

    constructor(@inject(INTERFACE_TYPE.CancelledOrderRepository) repository: ICancelledOrderRepository) {
        this.repository = repository;
    }

    async createCancelledOrder(input: any): Promise<any> {
        try {
            const result = await this.repository.createCancelledOrder(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in CancelledOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create cancel order. Please try again later.');
        }
    }

    async getCancelledOrder(id: number): Promise<any> {
        try {
            const result = await this.repository.getCancelledOrder(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve cancel order with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in CancelOrderInteractor. Please try again later.');
        }
    }

    async updateCancelledOrder(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateCancelledOrder(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating cancel order in CancelOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update cancel order. Please try again later.');
        }
    }

    async getCancelledOrders(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getCancelledOrders(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching cancel orders in CancelOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve cancel orders. Please try again later.');
        }
    }
}
