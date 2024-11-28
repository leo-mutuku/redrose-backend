import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IAccountInteractor } from "../../interfaces/finance/IAccountInteractor";
import { IAccountRepository } from "../../interfaces/finance/IAccountRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class AccountInteractor implements IAccountInteractor {
    private accountRepository: IAccountRepository;

    constructor(
        @inject(INTERFACE_TYPE.AccountRepository) accountRepository: IAccountRepository
    ) {
        this.accountRepository = accountRepository;
    }

    async createAccount(accountData: any): Promise<any> {
        try {
            return await this.accountRepository.createAccount(accountData);
        } catch (error) {
            throw new AppError("Failed to create account: " + error, 500);
        }
    }

    async getAccountById(account_id: number): Promise<any> {
        try {
            const account = await this.accountRepository.getAccountById(account_id);
            if (!account) {
                throw new AppError(`Account with ID ${account_id} not found.`);
            }
            return account;
        } catch (error) {
            throw new AppError("Failed to fetch account: " + error, 500);
        }
    }

    async getAllAccounts(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.accountRepository.getAllAccounts(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch accounts: " + error, 500);
        }
    }

    async updateAccount(account_id: number, updateData: any): Promise<any> {
        try {

            return await this.accountRepository.updateAccount(account_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update account: " + error, 500);
        }
    }

    async deleteAccount(accountId: number): Promise<void> {
        try {

            await this.accountRepository.deleteAccount(accountId);
        } catch (error) {
            throw new AppError("Failed to delete account: " + error, 500);
        }
    }
}
