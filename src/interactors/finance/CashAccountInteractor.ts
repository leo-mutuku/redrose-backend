import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { ICashAccountInteractor } from "../../interfaces/finance/ICashAccountInteractor";
import { ICashAccountRepository } from "../../interfaces/finance/ICashAccountRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class CashAccountInteractor implements ICashAccountInteractor {
    private cashAccountRepository: ICashAccountRepository;

    constructor(
        @inject(INTERFACE_TYPE.CashAccountRepository) cashAccountRepository: ICashAccountRepository
    ) {
        this.cashAccountRepository = cashAccountRepository;
    }

    async createCashAccount(cashAccountData: any): Promise<any> {
        try {
            return await this.cashAccountRepository.createCashAccount(cashAccountData);
        } catch (error) {
            throw new AppError("Failed to create cash account: " + error, 500);
        }
    }

    async getCashAccountById(cash_account_id: number): Promise<any> {
        try {
            const cashAccount = await this.cashAccountRepository.getCashAccountById(cash_account_id);
            if (!cashAccount) {
                throw new AppError(`Cash account with ID ${cash_account_id} not found.`);
            }
            return cashAccount;
        } catch (error) {
            throw new AppError("Failed to fetch cash account: " + error, 500);
        }
    }

    async getAllCashAccounts(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.cashAccountRepository.getAllCashAccounts(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch cash accounts: " + error, 500);
        }
    }

    async updateCashAccount(cash_account_id: number, updateData: any): Promise<any> {
        try {
            return await this.cashAccountRepository.updateCashAccount(cash_account_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update cash account: " + error, 500);
        }
    }

    async deleteCashAccount(cashAccountId: number): Promise<void> {
        try {
            await this.cashAccountRepository.deleteCashAccount(cashAccountId);
        } catch (error) {
            throw new AppError("Failed to delete cash account: " + error, 500);
        }
    }
}
