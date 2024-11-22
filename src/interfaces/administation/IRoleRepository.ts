import { Role } from "../../entities/administration/Roles"
export interface IRoleRepository {
    createRole(staff: Role): Promise<Role>
    getRole(username: string): Promise<Role>
    getRoles(staff: Role): Promise<Role>
    updateRole(id: number, staff: Role): Promise<Role>
}