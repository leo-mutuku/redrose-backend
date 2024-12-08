import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IStoreTransferInteractor } from "../../interfaces/store/IStoreTransferInteractor";
import { IStoreTransferRepository } from "../../interfaces/store/IStoreTransferRepository";

@injectable()
export class StoreTransferInteractor implements IStoreTransferInteractor {
    private repository: IStoreTransferRepository;

    constructor(
        @inject(INTERFACE_TYPE.StoreTransferRepository) repository: IStoreTransferRepository
    ) {
        this.repository = repository;
    }

    async createStoreTransfer(input: any): Promise<any> {
        try {
            const result = await this.repository.createStoreTransfer(input);

            // Add additional business logic if necessary
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error occurred in StoreTransferInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to create store transfer record. Please try again later.");
        }
    }

    async getStoreTransfer(id: number): Promise<any> {
        try {
            const result = await this.repository.getStoreTransfer(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve store transfer record with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in StoreTransferInteractor. Please try again later.");
        }
    }

    async updateStoreTransfer(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateStoreTransfer(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error updating store transfer record in StoreTransferInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to update store transfer record. Please try again later.");
        }
    }

    async getStoreTransfers(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getStoreTransfers(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error fetching store transfer records in StoreTransferInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to retrieve store transfer records. Please try again later.");
        }
    }
}
