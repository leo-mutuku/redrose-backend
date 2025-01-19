import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { ISalesOrderInteractor } from "../../interfaces/sales/ISalesOrderInteractor";
import { ISalesOrderRepository } from "../../interfaces/sales/ISalesOrderRepository";
import SalesReceipt from "../../external-libraries/posPrint";
import CustomerReceipt from "../../external-libraries/posPrint2";

@injectable()
export class SalesOrderInteractor implements ISalesOrderInteractor {
    private repository: ISalesOrderRepository;


    constructor(@inject(INTERFACE_TYPE.SalesOrderRepository) repository: ISalesOrderRepository) {
        this.repository = repository;

    }

    async createSalesOrder(input: any): Promise<any> {
        try {
            // Perform any necessary business logic or validation here
            const result = await this.repository.createSalesOrder(input);

            // print the result for debugging purposes  - to fail silently with sms notification
            // logic to prin here 

            // Business logic can be added here if needed
            const print = new SalesReceipt();
            const print2 = new CustomerReceipt();
            const header = {
                title: "BILL RECEIPT",
                date: new Date().toLocaleString(),
                customer: "customer",
                order_id: "988",
                staff_id: 99,
                total: 9000,
                payment_method: "cash",
                payment_status: "paid",
                status: "paid",
            }
            const body = result.map((item: any) => {
                return {
                    item_id: item.item_id,
                    item_name: item.item_name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                }
            })
            const footer = {
                total: 9000,
                paid: 9000,
                change: 0,
                balance: 0,
            }

            print.receipt(header, body, footer)
            print2.receipt(header, body, footer)



            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create sales order. Please try again later.');
        }
    }

    async getSalesOrder(id: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrder(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in SalesOrderInteractor. Please try again later.');
        }
    }


    async updateSalesOrder(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateSalesOrder(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(` ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update sales order. Please try again later.');
        }
    }

    async getSalesOrders(search: number, status: string, limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getSalesOrders(search, status, limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`Error fetching sales orders in SalesOrderInteractor: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve sales orders. Please try again later.');
        }
    }
    async authWaiter(pin: number, staff_id: number): Promise<any> {
        try {
            const result = await this.repository.authWaiter(pin, staff_id);
            return result;
        } catch (error) {
            // if (error instanceof AppError) {
            throw new AppError(`: ${error}`, 500);
        }

    }

    async voidedBill(input: any) {
        try {
            const result = await this.repository.voidedBill(input)
            return result

        } catch (error) {
            throw new AppError(`: ${error}`, 500)

        }
    }

    async printBill(input: any) {
        try {
            const result = await this.repository.printBill(input)
            return result

        }
        catch (error) {
            throw new AppError(`: ${error}`, 500)
        }
    }

    async cancelBill(input: any) {
        try {
            const result = await this.repository.cancelBill(input)
            return result

        } catch (error) {
            throw new AppError("" + error, 400)

        }
    }
}

