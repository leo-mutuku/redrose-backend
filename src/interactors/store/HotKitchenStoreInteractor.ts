import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IHotKitchenStoreInteractor } from "../../interfaces/store/IHotKitchenStoreInteractor";
import { IHotKitchenStoreRepository } from "../../interfaces/store/IHotKitchenStoreRepository";

@injectable()
export class HotKitchenStoreInteractor implements IHotKitchenStoreInteractor {
    private repository: IHotKitchenStoreRepository;

    constructor(
        @inject(INTERFACE_TYPE.HotKitchenStoreRepository) repository: IHotKitchenStoreRepository
    ) {
        this.repository = repository;
    }

    async createHotKitchenStore(input: any): Promise<any> {
        try {
            const result = await this.repository.createHotKitchenStore(input);

            // Add additional business logic if necessary
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error occurred in HotKitchenStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to create hot kitchen store record. Please try again later.");
        }
    }

    async getHotKitchenStore(id: number): Promise<any> {
        try {
            const result = await this.repository.getHotKitchenStore(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve hot kitchen store record with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in HotKitchenStoreInteractor. Please try again later.");
        }
    }
    async getKitchenTracking() {
        try {
            const result = await this.repository.getKitchenTracking()
            return result

        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve hot kitchen store record with I. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in HotKitchenStoreInteractor. Please try again later.");

        }

    }

    async updateHotKitchenStore(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateHotKitchenStore(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error updating hot kitchen store record in HotKitchenStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to update hot kitchen store record. Please try again later.");
        }
    }

    async getHotKitchenStores(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getHotKitchenStores(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error fetching hot kitchen store records in HotKitchenStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to retrieve hot kitchen store records. Please try again later.");
        }
    }
}
