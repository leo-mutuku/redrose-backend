import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IMpesaTillInteractor } from "../../interfaces/finance/IMpesaTillInteractor";
import { IMpesaTillRepository } from "../../interfaces/finance/IMpesaTillRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class MpesaTillInteractor implements IMpesaTillInteractor {
    private mpesaTillRepository: IMpesaTillRepository;

    constructor(
        @inject(INTERFACE_TYPE.MpesaTillRepository) mpesaTillRepository: IMpesaTillRepository
    ) {
        this.mpesaTillRepository = mpesaTillRepository;
    }

    async createMpesaTill(mpesaTillData: any): Promise<any> {
        try {
            return await this.mpesaTillRepository.createMpesaTill(mpesaTillData);
        } catch (error) {
            throw new AppError("Failed to create Mpesa till: " + error, 500);
        }
    }

    async getMpesaTillById(till_id: number): Promise<any> {
        try {
            const mpesaTill = await this.mpesaTillRepository.getMpesaTillById(till_id);
            if (!mpesaTill) {
                throw new AppError(`Mpesa till with ID ${till_id} not found.`);
            }
            return mpesaTill;
        } catch (error) {
            throw new AppError("Failed to fetch Mpesa till: " + error, 500);
        }
    }

    async getAllMpesaTills(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.mpesaTillRepository.getAllMpesaTill(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch Mpesa tills: " + error, 500);
        }
    }

    async updateMpesaTill(till_id: number, updateData: any): Promise<any> {
        try {
            return await this.mpesaTillRepository.updateMpesaTill(till_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update Mpesa till: " + error, 500);
        }
    }

    async deleteMpesaTill(till_id: number): Promise<void> {
        try {
            await this.mpesaTillRepository.deleteMpesaTill(till_id);
        } catch (error) {
            throw new AppError("Failed to delete Mpesa till: " + error, 500);
        }
    }
}
