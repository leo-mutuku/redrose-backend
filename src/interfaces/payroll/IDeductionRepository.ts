export interface IDeductionRepository {
    /**
     * Creates a new deduction record.
     * @param input - The data for the deduction (e.g., deduction name, type, amount, applicable employee IDs).
     * @returns A promise resolving to the created deduction record.
     */
    createDeduction(input: any): Promise<any>;

    /**
     * Retrieves a specific deduction record by its unique identifier.
     * @param id - The unique ID of the deduction record.
     * @returns A promise resolving to the requested deduction record or null if not found.
     */
    getDeduction(id: number): Promise<any>;

    /**
     * Updates the details of an existing deduction record.
     * @param id - The unique ID of the deduction record to update.
     * @param input - The updated data for the deduction record.
     * @returns A promise resolving to the updated deduction record.
     */
    updateDeduction(id: number, input: any): Promise<any>;

    /**
     * Deletes a specific deduction record.
     * @param id - The unique ID of the deduction record to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deleteDeduction(id: number): Promise<any>;

    /**
     * Retrieves a paginated list of deduction records.
     * @param limit - The maximum number of deduction records to fetch.
     * @param offset - The starting index for fetching deduction records.
     * @returns A promise resolving to a collection of deduction records.
     */
    getDeductions(limit: number, offset: number): Promise<any>;

    /**
     * Retrieves deductions applied to a specific employee.
     * @param employeeId - The unique ID of the employee.
     * @returns A promise resolving to a list of deductions applied to the specified employee.
     */
    getDeductionsByEmployee(employeeId: number): Promise<any>;
}
