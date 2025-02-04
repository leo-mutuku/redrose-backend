export interface ICashierRegisterRepository {
    /**
     * Opens a new cashier register.
     * @param input - The data for opening the register (e.g., starting balance, cashier details).
     * @returns A promise resolving to the created register record.
     */
    createCashierRegister(input: any): Promise<any>;

    /**
     * Retrieves a specific cashier register by its unique identifier.
     * @param id - The unique ID of the register.
     * @returns A promise resolving to the requested register record or null if not found.
     */
    getCashierRegister(id: number): Promise<any>;

    /**
     * Updates the details of a specific cashier register.
     * @param id - The unique ID of the register to update.
     * @param input - The updated data for the register.
     * @returns A promise resolving to the updated register record.
     */
    updateCashierRegister(id: number, input: any): Promise<any>;

    /**
     * Closes a specific cashier register.
     * @param id - The unique ID of the register to close.
     * @param input - The data required for closing the register (e.g., closing balance, remarks).
     * @returns A promise resolving to the closed register record.
     */
    //closeRegister(id: number, input: any): Promise<any>;

    /**
     * Retrieves a paginated list of cashier registers.
     * @param limit - The maximum number of registers to fetch.
     * @param offset - The starting index for fetching registers.
     * @returns A promise resolving to a collection of register records.
     */
    getCashierRegisters(limit: number, offset: number): Promise<any>;
    dispose(input: any): Promise<any>;
    clearBill(input: any): Promise<any>;
    cashierTransfer(input: any): Promise<any>;
    cashierReport(input: any): Promise<any>;
}
