export interface ICashAccountInteractor {
    /**
     * Creates a new cash account.
     * @param cashAccountData - The data for the new cash account.
     * @returns A promise that resolves to the newly created cash account.
     */
    createCashAccount(input: any);

    /**
     * Retrieves a cash account by its ID.
     * @param cashAccountId - The unique identifier of the cash account.
     * @returns A promise that resolves to the cash account details.
     */
    getCashAccountById(cash_account_id: number);

    /**
     * Retrieves all cash accounts.
     * @returns A promise that resolves to a list of cash accounts.
     */
    getAllCashAccounts(limit: number, offset: number);

    /**
     * Updates a cash account by its ID.
     * @param cashAccountId - The unique identifier of the cash account.
     * @param updateData - The data to update the cash account with.
     * @returns A promise that resolves to the updated cash account.
     */
    updateCashAccount(cash_account_id: number, updateData: any);

    /**
     * Deletes a cash account by its ID.
     * @param cashAccountId - The unique identifier of the cash account.
     * @returns A promise that resolves when the cash account is deleted.
     */
    deleteCashAccount(cash_account_id: number);
}
