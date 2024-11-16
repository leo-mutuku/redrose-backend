import { IUserRoleInteractor } from "../../interfaces/administation/IUserRoleInteractor";

export class UserRoleInteractor implements IUserRoleInteractor {
    getRoles(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    createUserRole(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserRole(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateUserRole(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getUserRoles(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}