export interface IPayrollSetupRepository {
    /**
     * Creates a new payroll setup record.
     * @param input - The data for the payroll setup (e.g., salary structure, benefits, and deductions).
     * @returns A promise resolving to the created payroll setup record.
     */
    createPayrollSetup(input: any): Promise<any>;

    /**
     * Retrieves a specific payroll setup by its unique identifier.
     * @param id - The unique ID of the payroll setup.
     * @returns A promise resolving to the requested payroll setup record or null if not found.
     */
    getPayrollSetup(id: number): Promise<any>;

    /**
     * Updates details of a specific payroll setup.
     * @param id - The unique ID of the payroll setup to update.
     * @param input - The updated data for the payroll setup.
     * @returns A promise resolving to the updated payroll setup record.
     */
    updatePayrollSetup(id: number, input: any): Promise<any>;

    /**
     * Deletes a specific payroll setup record.
     * @param id - The unique ID of the payroll setup to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deletePayrollSetup(id: number): Promise<any>;

    /**
     * Retrieves a paginated list of payroll setups.
     * @param limit - The maximum number of payroll setups to fetch.
     * @param offset - The starting index for fetching payroll setups.
     * @returns A promise resolving to a collection of payroll setup records.
     */
    getPayrollSetups(limit: number, offset: number): Promise<any>;
}
