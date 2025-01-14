export interface IPOSTerminalPrintBillRepository {

    printBill(billData: any): Promise<any>;


    getPrintStatus(billId: number): Promise<any>;


    cancelBillPrinting(billId: number): Promise<any>;


    getPrintedBills(limit: number, offset: number): Promise<any>;

    validateWaiter(input: any): Promise<any>;
}
