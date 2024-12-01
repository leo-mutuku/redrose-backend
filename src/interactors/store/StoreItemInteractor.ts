import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IStoreItemInteractor } from "../../interfaces/store/IStoreItemInteractor";
import { IStoreItemRepository } from "../../interfaces/store/IStoreItemRepository";

@injectable()
export class StoreItemInteractor implements IStoreItemInteractor {
    private repository: IStoreItemRepository;

    constructor(@inject(INTERFACE_TYPE.StoreItemRepository) repository: IStoreItemRepository) {
        this.repository = repository;
    }

    async createStoreItem(input: any): Promise<any> {
        try {
            const result = await this.repository.createStoreItem(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in StoreItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create store item. Please try again later.');
        }
    }

    async getStoreItem(id: number): Promise<any> {
        try {
            const result = await this.repository.getStoreItem(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve store item with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in StoreItemInteractor. Please try again later.');
        }
    }

    async updateStoreItem(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateStoreItem(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating store item in StoreItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update store item. Please try again later.');
        }
    }

    async getStoreItems(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getStoreItems(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching store items in StoreItemInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve store items. Please try again later.');
        }
    }
}
