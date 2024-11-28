import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IBankInteractor } from "../../interfaces/finance/IBankInteractor";
import { IBankRepository } from "../../interfaces/finance/IBankRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class BankInteractor implements IBankInteractor {
    private bankRepository: IBankRepository;

    constructor(
        @inject(INTERFACE_TYPE.BankRepository) bankRepository: IBankRepository
    ) {
        this.bankRepository = bankRepository;
    }

    async createBank(bankData: any): Promise<any> {
        try {
            return await this.bankRepository.createBank(bankData);
        } catch (error) {
            throw new AppError("Failed to create bank: " + error, 500);
        }
    }

    async getBankById(bank_id: number): Promise<any> {
        try {
            const bank = await this.bankRepository.getBankById(bank_id);
            if (!bank) {
                throw new AppError(`Bank with ID ${bank_id} not found.`);
            }
            return bank;
        } catch (error) {
            throw new AppError("Failed to fetch bank: " + error, 500);
        }
    }

    async getAllBanks(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.bankRepository.getAllBanks(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch banks: " + error, 500);
        }
    }

    async updateBank(bank_id: number, updateData: any): Promise<any> {
        try {
            return await this.bankRepository.updateBank(bank_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update bank: " + error, 500);
        }
    }

    async deleteBank(bankId: number): Promise<void> {
        try {
            await this.bankRepository.deleteBank(bankId);
        } catch (error) {
            throw new AppError("Failed to delete bank: " + error, 500);
        }
    }
}
