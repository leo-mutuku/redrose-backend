import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IRestaurantStoreInteractor } from "../../interfaces/store/IRestaurantStoreInteractor";
import { IRestaurantStoreRepository } from "../../interfaces/store/IRestaurantStoreRepository";

@injectable()
export class RestaurantStoreInteractor implements IRestaurantStoreInteractor {
    private repository: IRestaurantStoreRepository;

    constructor(
        @inject(INTERFACE_TYPE.RestaurantStoreRepository) repository: IRestaurantStoreRepository
    ) {
        this.repository = repository;
    }

    async createRestaurantStore(input: any): Promise<any> {
        try {
            const result = await this.repository.createRestaurantStore(input);

            // Add additional business logic if necessary
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error occurred in RestaurantStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to create restaurant store record. Please try again later.");
        }
    }

    async getRestaurantStore(id: number): Promise<any> {
        try {
            const result = await this.repository.getRestaurantStore(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve restaurant store record with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in RestaurantStoreInteractor. Please try again later.");
        }
    }

    async getRestaurantTracking(): Promise<any> {
        try {
            const result = await this.repository.getRestaurantTracking();
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve restaurant tracking records. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Error occurred in RestaurantStoreInteractor. Please try again later.");
        }
    }

    async updateRestaurantStore(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateRestaurantStore(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error updating restaurant store record in RestaurantStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to update restaurant store record. Please try again later.");
        }
    }

    async getRestaurantStores(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getRestaurantStores(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error fetching restaurant store records in RestaurantStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to retrieve restaurant store records. Please try again later.");
        }
    }

    async deleteRestaurantStore(id: number): Promise<void> {
        try {
            await this.repository.deleteRestaurantStore(id);
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Error deleting restaurant store record in RestaurantStoreInteractor: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error("Failed to delete restaurant store record. Please try again later.");
        }
    }
}
