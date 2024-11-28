export interface ICashAccountRepository {
    /**
     * Creates a new cash account record.
     * @param cashAccountData - The data for the cash account to be created.
     * @returns A promise that resolves with the created cash account record.
     */
    createCashAccount(input: any): Promise<any>;

    /**
     * Finds a cash account record by its ID.
     * @param cashAccountId - The ID of the cash account to find.
     * @returns A promise that resolves with the cash account record or null if not found.
     */
    getCashAccountById(cash_account_id: number): Promise<any | null>;

    /**
     * Retrieves all cash account records.
     * @param limit - The maximum number of records to retrieve.
     * @param offset - The starting point for retrieving records.
     * @returns A promise that resolves with an array of cash account records.
     */
    getAllCashAccounts(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing cash account record by its ID.
     * @param cashAccountId - The ID of the cash account to update.
     * @param updateData - The data to update the cash account record with.
     * @returns A promise that resolves with the updated cash account record.
     */
    updateCashAccount(cash_account_id: number, updateData: any): Promise<any>;

    /**
     * Deletes a cash account record by its ID.
     * @param cashAccountId - The ID of the cash account to delete.
     * @returns A promise that resolves when the cash account record is deleted.
     */
    deleteCashAccount(cash_account_id: number): Promise<void>;
}
