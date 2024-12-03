import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IKitchenStationInteractor } from "../../interfaces/kitchen/IKitchenStationInteractor";
import { IKitchenStationRepository } from "../../interfaces/kitchen/IKitchenStationRepository";

@injectable()
export class KitchenStationInteractor implements IKitchenStationInteractor {
    private repository: IKitchenStationRepository;

    constructor(@inject(INTERFACE_TYPE.KitchenStationRepository) repository: IKitchenStationRepository) {
        this.repository = repository;
    }

    async createKitchenStation(input: any): Promise<any> {
        try {
            const result = await this.repository.createKitchenStation(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in KitchenStationInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create kitchen station. Please try again later.');
        }
    }

    async getKitchenStation(id: number): Promise<any> {
        try {
            const result = await this.repository.getKitchenStation(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve kitchen station with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in KitchenStationInteractor. Please try again later.');
        }
    }

    async updateKitchenStation(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateKitchenStation(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating kitchen station in KitchenStationInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update kitchen station. Please try again later.');
        }
    }

    async getKitchenStations(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getKitchenStations(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching kitchen stations in KitchenStationInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve kitchen stations. Please try again later.');
        }
    }
}
