import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IGLAccountInteractor } from "../../interfaces/finance/IGLAccountInteractor";
import { IGLAccountRepository } from "../../interfaces/finance/IGLAccountRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class GLAccountInteractor implements IGLAccountInteractor {
    private glAccountRepository: IGLAccountRepository;

    constructor(
        @inject(INTERFACE_TYPE.GLAccountRepository) glAccountRepository: IGLAccountRepository
    ) {
        this.glAccountRepository = glAccountRepository;
    }

    async createGLAccount(glAccountData: any): Promise<any> {
        try {
            return await this.glAccountRepository.createGLAccount(glAccountData);
        } catch (error) {
            throw new AppError("Failed to create GL account: " + error, 500);
        }
    }

    async getGLAccountById(account_id: number): Promise<any> {
        try {
            const glAccount = await this.glAccountRepository.getGLAccountById(account_id);
            if (!glAccount) {
                throw new AppError(`GL account with ID ${account_id} not found.`);
            }
            return glAccount;
        } catch (error) {
            throw new AppError("Failed to fetch GL account: " + error, 500);
        }
    }

    async getAllGLAccounts(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.glAccountRepository.getAllGLAccounts(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch GL accounts: " + error, 500);
        }
    }

    async updateGLAccount(account_id: number, updateData: any): Promise<any> {
        try {
            return await this.glAccountRepository.updateGLAccount(account_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update GL account: " + error, 500);
        }
    }

    async deleteGLAccount(accountId: number): Promise<void> {
        try {
            await this.glAccountRepository.deleteGLAccount(accountId);
        } catch (error) {
            throw new AppError("Failed to delete GL account: " + error, 500);
        }
    }
}
