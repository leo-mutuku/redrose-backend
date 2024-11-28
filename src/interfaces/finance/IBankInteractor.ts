export interface IBankInteractor {
    /**
     * Creates a new bank account.
     * @param bankData - The data for the new bank account.
     * @returns A promise that resolves to the newly created bank account.
     */
    createBank(input: any);

    /**
     * Retrieves a bank account by its ID.
     * @param bankId - The unique identifier of the bank account.
     * @returns A promise that resolves to the bank account details.
     */
    getBankById(bank_id: number);

    /**
     * Retrieves all bank accounts.
     * @returns A promise that resolves to a list of bank accounts.
     */
    getAllBanks(limit: number, offset: number);

    /**
     * Updates a bank account by its ID.
     * @param bankId - The unique identifier of the bank account.
     * @param updateData - The data to update the bank account with.
     * @returns A promise that resolves to the updated bank account.
     */
    updateBank(bank_id: number, updateData: any);

    /**
     * Deletes a bank account by its ID.
     * @param bankId - The unique identifier of the bank account.
     * @returns A promise that resolves when the bank account is deleted.
     */
    deleteBank(bank_id: number);
}
