import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IKitchenSetupInteractor } from "../../interfaces/kitchen/IKitchenSetupInteractor";
import { IKitchenSetupRepository } from "../../interfaces/kitchen/IKitchenSetupRepository";

@injectable()
export class KitchenSetupInteractor implements IKitchenSetupInteractor {
    private repository: IKitchenSetupRepository;

    constructor(@inject(INTERFACE_TYPE.KitchenSetupRepository) repository: IKitchenSetupRepository) {
        this.repository = repository;
    }

    async createKitchenSetup(input: any): Promise<any> {
        try {
            const result = await this.repository.createKitchenSetup(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in KitchenSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create kitchen setup. Please try again later.');
        }
    }

    async getKitchenSetup(id: number): Promise<any> {
        try {
            const result = await this.repository.getKitchenSetup(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve kitchen setup with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in KitchenSetupInteractor. Please try again later.');
        }
    }

    async updateKitchenSetup(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateKitchenSetup(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating kitchen setup in KitchenSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update kitchen setup. Please try again later.');
        }
    }

    async getKitchenSetups(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getKitchenSetups(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching kitchen setups in KitchenSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve kitchen setups. Please try again later.');
        }
    }

    //deleteKitchenSetup
    async deleteKitchenSetup(id: number): Promise<any> {
        try {
            const result = await this.repository.deleteKitchenSetup(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error deleting kitchen setup in KitchenSetupInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to delete kitchen setup. Please try again later.');
        }
    }
}
