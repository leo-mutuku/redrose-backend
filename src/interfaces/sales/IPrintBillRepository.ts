export interface IPrintBillRepository {
    printBill(bill_id: number): Promise<any>;

}