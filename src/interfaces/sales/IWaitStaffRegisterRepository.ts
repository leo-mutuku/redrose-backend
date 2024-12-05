export interface IWaitStaffRegisterRepository {
    /**
     * Creates a new wait staff register record.
     * @param input - The data for the wait staff register (e.g., start time, staff details).
     * @returns A promise resolving to the created wait staff register.
     */
    createWaitStaffRegister(input: any): Promise<any>;

    /**
     * Retrieves a specific wait staff register by its unique identifier.
     * @param id - The unique ID of the wait staff register.
     * @returns A promise resolving to the requested wait staff register or null if not found.
     */
    getWaitStaffRegister(id: number): Promise<any>;

    /**
     * Updates details of a specific wait staff register.
     * @param id - The unique ID of the wait staff register to update.
     * @param input - The updated data for the wait staff register.
     * @returns A promise resolving to the updated wait staff register.
     */
    updateWaitStaffRegister(id: number, input: any): Promise<any>;

    /**
     * Retrieves a paginated list of wait staff registers.
     * @param limit - The maximum number of wait staff registers to fetch.
     * @param offset - The starting index for fetching wait staff registers.
     * @returns A promise resolving to a collection of wait staff registers.
     */
    getWaitStaffRegisters(limit: number, offset: number): Promise<any>;
}
