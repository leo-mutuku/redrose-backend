import { IShiftInteractor } from "../../interfaces/administation/IShiftInteractor";
import { Shift } from "../../entities/administration/Shift";
import { IShiftRepository } from "../../interfaces/administation/IShiftRepository";
import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";

@injectable()
export class ShiftInteractor implements IShiftInteractor {
    private repository: IShiftRepository;

    constructor(@inject(INTERFACE_TYPE.ShiftRepository) repository: IShiftRepository) {
        this.repository = repository;
    }
    async createShift(shift: Shift): Promise<any> {
        try {
            const result = await this.repository.createShift(shift)
            return result
        } catch (error) {
            throw new AppError(
                `Failed to create shift. Reason: ` + error,
                (error as AppError).statusCode || 500
            );
        }
    }
    async getShift(id: number): Promise<any> {
        try {
            const result = await this.repository.getShift(id)
            return result

        } catch (error) {
            throw new AppError(
                `${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );

        }
    }
    async getShifts(limit: number, offset: number) {
        try {
            const result = await this.repository.getShifts(limit, offset)
            return result
        } catch (error) {
            throw new AppError(
                `Failed to get shifts. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );
        }

    }
    async updateShift(id: number, shift: Shift) {
        try {
            const result = await this.repository.updateShift(id, shift)
            return result
        } catch (error) {
            throw new AppError(
                `Failed to update shift. Reason: ${(error as AppError).message}`,
                (error as AppError).statusCode || 500
            );
        }

    }



}