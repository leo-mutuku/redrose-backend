export interface IPayrollSetupInteractor {
    /**
     * Processes and creates a new payroll record.
     * @param input - The data for the payroll (e.g., employee details, earnings, deductions, and net pay).
     * @returns A promise resolving to the created payroll record.
     */
    createPayroll(input: any);

    /**
     * Retrieves a specific payroll record by its unique identifier.
     * @param id - The unique ID of the payroll record.
     * @returns A promise resolving to the requested payroll record or null if not found.
     */
    getPayroll(id: number);

    /**
     * Updates a specific payroll record.
     * @param id - The unique ID of the payroll record to update.
     * @param input - The updated data for the payroll record.
     * @returns A promise resolving to the updated payroll record.
     */
    updatePayroll(id: number, input: any);

    /**
     * Deletes a specific payroll record.
     * @param id - The unique ID of the payroll record to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deletePayroll(id: number);

    /**
     * Retrieves a paginated list of payroll records.
     * @param limit - The maximum number of payroll records to fetch.
     * @param offset - The starting index for fetching payroll records.
     * @returns A promise resolving to a collection of payroll records.
     */
    getPayrolls(limit: number, offset: number);

    /**
     * Calculates payroll details for a given period.
     * @param input - The calculation parameters (e.g., date range, employee details).
     * @returns A promise resolving to the calculated payroll data.
     */
    calculatePayroll(input: any);

    /**
     * Marks a payroll record as finalized for the given period.
     * @param id - The unique ID of the payroll record to finalize.
     * @returns A promise resolving to the finalized payroll record.
     */
    finalizePayroll(id: number);
}
