export interface IAccountRepository {
    /**
     * Creates a new account.
     * @param accountData - The data for the account to be created.
     * @returns A promise that resolves with the created account.
     */
    createAccount(input: any): Promise<any>;

    /**
     * Finds an account by its ID.
     * @param accountId - The ID of the account to find.
     * @returns A promise that resolves with the account or null if not found.
     */
    getAccountById(account_id: number): Promise<any | null>;

    /**
     * Retrieves all accounts.
     * @returns A promise that resolves with an array of all accounts.
     */
    getAllAccounts(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing account by its ID.
     * @param accountId - The ID of the account to update.
     * @param updateData - The data to update the account with.
     * @returns A promise that resolves with the updated account.
     */
    updateAccount(account_id: number, updateData: any): Promise<any>;

    /**
     * Deletes an account by its ID.
     * @param accountId - The ID of the account to delete.
     * @returns A promise that resolves when the account is deleted.
     */
    deleteAccount(account_id: number): Promise<void>;
}
