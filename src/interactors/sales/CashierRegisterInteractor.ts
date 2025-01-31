import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import { ICashierRegisterInteractor } from "../../interfaces/sales/ICashierRegisterInteractor";
import { ICashierRegisterRepository } from "../../interfaces/sales/ICashierRegisterRepository";
import { SMSService } from "../../external-libraries/SMSService";


@injectable()
export class CashierRegisterInteractor implements ICashierRegisterInteractor {
    private repository: ICashierRegisterRepository;

    constructor(@inject(INTERFACE_TYPE.CashierRegisterRepository) repository: ICashierRegisterRepository) {
        this.repository = repository;
    }

    async createCashierRegister(input: any): Promise<any> {
        try {
            const result = await this.repository.createCashierRegister(input);
            console.log(result)
            // Business logic can be added here if needed
            const smsService = new SMSService();
            const message = `Your Cashier Account has been created successfully. Your cashier account balance is ${result.balance}.`;
            const phoneNumber = result.staffPhone;
            await smsService.sendSingle(phoneNumber, message);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create cashier register. Please try again later.');
        }
    }

    async getCashierRegister(id: number): Promise<any> {
        try {
            const result = await this.repository.getCashierRegister(id);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(
                    `Failed to retrieve cashier register with ID ${id}. Reason: ${error.message}`,
                    error.statusCode || 500
                );
            }
            throw new Error('Error occurred in CashierRegisterInteractor. Please try again later.');
        }
    }

    async updateCashierRegister(id: number, input: any): Promise<any> {
        try {
            const result = await this.repository.updateCashierRegister(id, input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to update cashier register. Please try again later.');
        }
    }

    async getCashierRegisters(limit: number, offset: number): Promise<any> {
        try {
            const result = await this.repository.getCashierRegisters(limit, offset);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to retrieve cashier registers. Please try again later.');
        }
    }

    async dispose(input: any) {
        try {

        } catch (error) {

        }
    }
    async clearBill(input: any) {
        try {
            const result = await this.repository.clearBill(input);
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw new AppError(`: ${error.message}`, error.statusCode || 500);
            }
            throw new Error('Failed to create cashier register. Please try again later.');
        }
    }

    async cashierTransfer(input: any) {
        throw new Error("Method not implemented.");
    }
}
