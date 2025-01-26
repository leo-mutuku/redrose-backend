import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPurchaseOrderInteractor } from "../../interfaces/purchase/IPurchaseOrderInteractor";
import { IPurchaseOrderRepository } from "../../interfaces/purchase/IpurchaseOrderRepository";

@injectable()
export class PurchaseOrderInteractor implements IPurchaseOrderInteractor {
    private repository: IPurchaseOrderRepository;

    constructor(@inject(INTERFACE_TYPE.PurchaseOrderRepository) repository: IPurchaseOrderRepository) {
        this.repository = repository;
    }

    async createPurchaseOrder(input: any): Promise<any> {
        try {
            const result = await this.repository.createPurchaseOrder(input);

            // Business logic can be added here if needed
            // send sms to the supplier
            // print supplier receipt
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(` ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create purchase order. Please try again later.');
        }
    }

    async getPurchaseOrder(id: number): Promise<any> {
        try {
            const result = await this.repository.getPurchaseOrder(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve purchase order with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PurchaseOrderInteractor. Please try again later.');
        }
    }

    async updatePurchaseOrder(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePurchaseOrder(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating purchase order in PurchaseOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update purchase order. Please try again later.');
        }
    }

    async getPurchaseOrders(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPurchaseOrders(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching purchase orders in PurchaseOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve purchase orders. Please try again later.');
        }
    }
}
