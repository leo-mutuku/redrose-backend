import { IUserInteractor } from "../../interfaces/administation/IUserInteractor";

export class UserInteractor implements IUserInteractor {
    createUser(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUser(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateUser(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getVendors(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }


}