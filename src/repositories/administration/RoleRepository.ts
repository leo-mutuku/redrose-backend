import { Role } from "../../entities/administration/Roles";
import { IRoleRepository } from "../../interfaces/administation/IRoleRepository";

export class RoleRepository implements IRoleRepository {
    createRole(staff: Role): Promise<Role> {
        throw new Error("Method not implemented.");
    }
    getRole(username: string): Promise<Role> {
        throw new Error("Method not implemented.");
    }
    getRoles(staff: Role): Promise<Role> {
        throw new Error("Method not implemented.");
    }
    updateRole(id: number, staff: Role): Promise<Role> {
        throw new Error("Method not implemented.");
    }

}