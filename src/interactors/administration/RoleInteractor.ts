import { IRoleInteractor } from "../../interfaces/administation/IRoleInteracter";

export class RoleInteractor implements IRoleInteractor {
    createRole(input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getRole(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateRole(id: number, input: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getRoles(limit: number, offset: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
}