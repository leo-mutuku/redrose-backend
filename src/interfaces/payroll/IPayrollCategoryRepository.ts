export interface IPayrollCategoryRepository {
    /**
     * Creates a new payroll category.
     * @param input - The data for the payroll category (e.g., category name, type, and applicable rules).
     * @returns A promise resolving to the created payroll category record.
     */
    createPayrollCategory(input: any): Promise<any>;

    /**
     * Retrieves a specific payroll category by its unique identifier.
     * @param id - The unique ID of the payroll category.
     * @returns A promise resolving to the requested payroll category record or null if not found.
     */
    getPayrollCategory(id: number): Promise<any>;

    /**
     * Updates details of a specific payroll category.
     * @param id - The unique ID of the payroll category to update.
     * @param input - The updated data for the payroll category.
     * @returns A promise resolving to the updated payroll category record.
     */
    updatePayrollCategory(id: number, input: any): Promise<any>;

    /**
     * Deletes a specific payroll category.
     * @param id - The unique ID of the payroll category to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    //deletePayrollCategory(id: number): Promise<any>;

    /**
     * Retrieves a paginated list of payroll categories.
     * @param limit - The maximum number of payroll categories to fetch.
     * @param offset - The starting index for fetching payroll categories.
     * @returns A promise resolving to a collection of payroll category records.
     */
    getPayrollCategories(limit: number, offset: number): Promise<any>;
}
