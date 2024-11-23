import { Role } from "../../entities/administration/Roles"
export interface IRoleRepository {
    createRole(staff: Role): Promise<Role>
    getRole(role_id: number): Promise<Role>
    getRoles(limit: number, offset: number): Promise<Role>
    updateRole(id: number, staff: Role): Promise<Role>
}