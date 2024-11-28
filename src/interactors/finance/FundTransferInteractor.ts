import { injectable, inject } from "inversify";
import { INTERFACE_TYPE } from "../../utils";
import { IFundTransferInteractor } from "../../interfaces/finance/IFundTransferInteractor";
import { IFundTransferRepository } from "../../interfaces/finance/IFundTransferRepository";
import { AppError } from "../../utils/AppError";

@injectable()
export class FundTransferInteractor implements IFundTransferInteractor {
    private fundTransferRepository: IFundTransferRepository;

    constructor(
        @inject(INTERFACE_TYPE.FundTransferRepository) fundTransferRepository: IFundTransferRepository
    ) {
        this.fundTransferRepository = fundTransferRepository;
    }
    initiateFundTransfer(transferData: any) {
        throw new Error("Method not implemented.");
    }

    async createFundTransfer(fundTransferData: any): Promise<any> {
        try {
            return await this.fundTransferRepository.createFundTransfer(fundTransferData);
        } catch (error) {
            throw new AppError("Failed to create fund transfer: " + error, 500);
        }
    }

    async getFundTransferById(transfer_id: number): Promise<any> {
        try {
            const fundTransfer = await this.fundTransferRepository.getFundTransferById(transfer_id);
            if (!fundTransfer) {
                throw new AppError(`Fund transfer with ID ${transfer_id} not found.`);
            }
            return fundTransfer;
        } catch (error) {
            throw new AppError("Failed to fetch fund transfer: " + error, 500);
        }
    }

    async getAllFundTransfers(limit: number, offset: number): Promise<any[]> {
        try {
            return await this.fundTransferRepository.getAllFundTransfers(limit, offset);
        } catch (error) {
            throw new AppError("Failed to fetch fund transfers: " + error, 500);
        }
    }

    async updateFundTransfer(transfer_id: number, updateData: any): Promise<any> {
        try {
            return await this.fundTransferRepository.updateFundTransfer(transfer_id, updateData);
        } catch (error) {
            throw new AppError("Failed to update fund transfer: " + error, 500);
        }
    }

    async deleteFundTransfer(transferId: number): Promise<void> {
        try {
            await this.fundTransferRepository.deleteFundTransfer(transferId);
        } catch (error) {
            throw new AppError("Failed to delete fund transfer: " + error, 500);
        }
    }
}
