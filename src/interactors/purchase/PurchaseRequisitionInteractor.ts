import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPurchaseRequisitionInteractor } from "../../interfaces/purchase/IpurchaseRequisitionInteractor";
import { IPurchaseRequisitionRepository } from "../../interfaces/purchase/IPurchaseRequisitionRepository";

@injectable()
export class PurchaseRequisitionInteractor implements IPurchaseRequisitionInteractor {
    private repository: IPurchaseRequisitionRepository;

    constructor(@inject(INTERFACE_TYPE.PurchaseRequisitionRepository) repository: IPurchaseRequisitionRepository) {
        this.repository = repository;
    }

    async createPurchaseRequisition(input: any): Promise<any> {
        try {
            const result = await this.repository.createPurchaseRequisition(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in PurchaseRequisitionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create purchase requisition. Please try again later.');
        }
    }

    async getPurchaseRequisition(id: number): Promise<any> {
        try {
            const result = await this.repository.getPurchaseRequisition(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve purchase requisition with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in PurchaseRequisitionInteractor. Please try again later.');
        }
    }

    async updatePurchaseRequisition(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updatePurchaseRequisition(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating purchase requisition in PurchaseRequisitionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update purchase requisition. Please try again later.');
        }
    }

    async getPurchaseRequisitions(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPurchaseRequisitions(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching purchase requisitions in PurchaseRequisitionInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve purchase requisitions. Please try again later.');
        }
    }
}
