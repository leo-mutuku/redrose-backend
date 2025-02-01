export interface ISalesOrderRepository {
    /**
     * Creates a new sales order.
     * @param input - The data for the sales order.
     * @returns A promise resolving to the created sales order.
     */
    createSalesOrder(input: any): Promise<any>;

    /**
     * Retrieves a specific sales order by its unique identifier.
     * @param id - The unique ID of the sales order.
     * @returns A promise resolving to the requested sales order or null if not found.
     */
    getSalesOrder(id: number): Promise<any>;

    /**
     * Updates the details of a specific sales order.
     * @param id - The unique ID of the sales order to update.
     * @param input - The updated data for the sales order.
     * @returns A promise resolving to the updated sales order.
     */
    updateSalesOrder(id: number, input: any): Promise<any>;

    /**
     * Retrieves a paginated list of sales orders.
     * @param limit - The maximum number of sales orders to fetch.
     * @param offset - The starting index for fetching sales orders.
     * @returns A promise resolving to a collection of sales orders.
     */
    getSalesOrders(search: number, status: string, limit: number, offset: number): Promise<any>;
    authWaiter(pin: number, staff_id: number): Promise<any>;
    voidedBill(input: any): Promise<any>
    printBill(input: any): Promise<any>
    cancelBill(input: any): Promise<any>

    /**
     * Deletes a specific sales order.
     * @param id - The unique ID of the sales order to delete.
     * @returns A promise resolving to a confirmation or an error if the deletion fails.
     */
    deleteSalesOrder(id: number): Promise<any>;
    getPostedSalesOrder(): Promise<any>

}
