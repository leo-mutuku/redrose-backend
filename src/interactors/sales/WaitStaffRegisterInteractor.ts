import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IWaitStaffRegisterInteractor } from "../../interfaces/store/IWaitStaffRegisterInteractor";
import { IWaitStaffRegisterRepository } from "../../interfaces/store/IWaitStaffRegisterRepository";

@injectable()
export class WaitStaffRegisterInteractor implements IWaitStaffRegisterInteractor {
    private repository: IWaitStaffRegisterRepository;

    constructor(@inject(INTERFACE_TYPE.WaitStaffRegisterRepository) repository: IWaitStaffRegisterRepository) {
        this.repository = repository;
    }

    async createWaitStaffRegister(input: any): Promise<any> {
        try {
            const result = await this.repository.createWaitStaffRegister(input);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in WaitStaffRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create wait staff register. Please try again later.');
        }
    }

    async getWaitStaffRegister(id: number): Promise<any> {
        try {
            const result = await this.repository.getWaitStaffRegister(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve wait staff register with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in WaitStaffRegisterInteractor. Please try again later.');
        }
    }

    async updateWaitStaffRegister(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateWaitStaffRegister(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error updating wait staff register in WaitStaffRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update wait staff register. Please try again later.');
        }
    }

    async getWaitStaffRegisters(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getWaitStaffRegisters(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching wait staff registers in WaitStaffRegisterInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve wait staff registers. Please try again later.');
        }
    }
}
