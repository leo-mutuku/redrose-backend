export interface IAccountInteractor {
    /**
     * Creates a new account.
     * @param accountData - The data for the new account.
     * @returns A promise that resolves to the newly created account.
     */
    createAccount(accountData: any): Promise<any>;

    /**
     * Retrieves an account by its ID.
     * @param accountId - The unique identifier of the account.
     * @returns A promise that resolves to the account details.
     */
    getAccountById(accountId: string): Promise<any>;

    /**
     * Retrieves all accounts.
     * @returns A promise that resolves to a list of accounts.
     */
    getAllAccounts(): Promise<any[]>;

    /**
     * Updates an account by its ID.
     * @param accountId - The unique identifier of the account.
     * @param updateData - The data to update the account with.
     * @returns A promise that resolves to the updated account.
     */
    updateAccount(accountId: string, updateData: any): Promise<any>;

    /**
     * Deletes an account by its ID.
     * @param accountId - The unique identifier of the account.
     * @returns A promise that resolves when the account is deleted.
     */
    deleteAccount(accountId: string): Promise<void>;
}
