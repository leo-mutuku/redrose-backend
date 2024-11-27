import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IAccountInteractor } from "../../interfaces/finance/IAccountInteractor";
import { IAccountRepository } from "../../interfaces/finance/IAccountRepository";

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
            return await this.accountRepository.create(accountData);
        } catch (error) {
            throw new Error("Failed to create account: " + error.message);
        }
    }

    async getAccountById(accountId: string): Promise<any> {
        try {
            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new Error(`Account with ID ${accountId} not found.`);
            }
            return account;
        } catch (error) {
            throw new Error("Failed to fetch account: " + error.message);
        }
    }

    async getAllAccounts(): Promise<any[]> {
        try {
            return await this.accountRepository.findAll();
        } catch (error) {
            throw new Error("Failed to fetch accounts: " + error.message);
        }
    }

    async updateAccount(accountId: string, updateData: any): Promise<any> {
        try {
            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new Error(`Account with ID ${accountId} not found.`);
            }
            return await this.accountRepository.update(accountId, updateData);
        } catch (error) {
            throw new Error("Failed to update account: " + error.message);
        }
    }

    async deleteAccount(accountId: string): Promise<void> {
        try {
            const account = await this.accountRepository.findById(accountId);
            if (!account) {
                throw new Error(`Account with ID ${accountId} not found.`);
            }
            await this.accountRepository.delete(accountId);
        } catch (error) {
            throw new Error("Failed to delete account: " + error.message);
        }
    }
}
