import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { IPOSTerminalPrintBillInteractor } from "../../interfaces/sales/IPOSTerminalPrintBillInteractor";
import { IPOSTerminalPrintBillRepository } from "../../interfaces/sales/IPOSTerminalPrintBillRepository";

@injectable()
export class POSTerminalPrintBillInteractor implements IPOSTerminalPrintBillInteractor {
    private repository: IPOSTerminalPrintBillRepository;

    constructor(@inject(INTERFACE_TYPE.POSTerminalPrintBillRepository) repository: IPOSTerminalPrintBillRepository) {
        this.repository = repository;
    }

    async printBill(billData: any): Promise<any> {
        try {
            const result = await this.repository.printBill(billData);

            // Business logic can be added here if needed
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error occurred in POSTerminalPrintBillInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to print the bill. Please try again later.');
        }
    }

    async getPrintStatus(billId: number): Promise<any> {
        try {
            const result = await this.repository.getPrintStatus(billId);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve print status for bill ID ${billId}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred while fetching print status. Please try again later.');
        }
    }

    async cancelBillPrinting(billId: number): Promise<any> {
        try {
            const result = await this.repository.cancelBillPrinting(billId);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error cancelling print job for bill ID ${billId}: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to cancel bill printing. Please try again later.');
        }
    }

    async getPrintedBills(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getPrintedBills(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching printed bills in POSTerminalPrintBillInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve printed bills. Please try again later.');
        }
    }
    async validateWaiter(input: any): Promise<any> {
        try {
            console.log("input", input);
            const result = await this.repository.validateWaiter(input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error validating waiter in POSTerminalPrintBillInteractor: ${error}`, error.statusCode || 500);
            }
            throw new Error('Failed to validate waiter. Please try again later.');
        }
    }
}
