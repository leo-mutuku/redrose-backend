export interface IGLAccountInteractor {
    /**
     * Creates a new General Ledger (GL) account.
     * @param glAccountData - The data for the new GL account.
     * @returns A promise that resolves to the newly created GL account.
     */
    createGLAccount(input: any);

    /**
     * Retrieves a GL account by its ID.
     * @param glAccountId - The unique identifier of the GL account.
     * @returns A promise that resolves to the GL account details.
     */
    getGLAccountById(gl_account_id: number);

    /**
     * Retrieves all GL accounts.
     * @returns A promise that resolves to a list of GL accounts.
     */
    getAllGLAccounts(limit: number, offset: number);

    /**
     * Updates a GL account by its ID.
     * @param glAccountId - The unique identifier of the GL account.
     * @param updateData - The data to update the GL account with.
     * @returns A promise that resolves to the updated GL account.
     */
    updateGLAccount(gl_account_id: number, updateData: any);

    /**
     * Deletes a GL account by its ID.
     * @param glAccountId - The unique identifier of the GL account.
     * @returns A promise that resolves when the GL account is deleted.
     */
    deleteGLAccount(gl_account_id: number);
}
