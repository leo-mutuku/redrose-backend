export interface IGLAccountRepository {
    /**
     * Creates a new general ledger (GL) account record.
     * @param glAccountData - The data for the GL account to be created.
     * @returns A promise that resolves with the created GL account record.
     */
    createGLAccount(input: any): Promise<any>;

    /**
     * Finds a GL account record by its ID.
     * @param glAccountId - The ID of the GL account to find.
     * @returns A promise that resolves with the GL account record or null if not found.
     */
    getGLAccountById(gl_account_id: number): Promise<any | null>;

    /**
     * Retrieves all GL account records.
     * @param limit - The maximum number of records to retrieve.
     * @param offset - The starting point for retrieving records.
     * @returns A promise that resolves with an array of GL account records.
     */
    getAllGLAccounts(limit: number, offset: number): Promise<any[]>;

    /**
     * Updates an existing GL account record by its ID.
     * @param glAccountId - The ID of the GL account to update.
     * @param updateData - The data to update the GL account record with.
     * @returns A promise that resolves with the updated GL account record.
     */
    updateGLAccount(gl_account_id: number, updateData: any): Promise<any>;

    /**
     * Deletes a GL account record by its ID.
     * @param glAccountId - The ID of the GL account to delete.
     * @returns A promise that resolves when the GL account record is deleted.
     */
    deleteGLAccount(gl_account_id: number): Promise<void>;
}
