import { Auth } from "../../entities/administration/Auth"
export interface IAuthRepository {
    login(auth: Auth): Promise<Auth>
    register(auth: Auth): Promise<Auth>
    forgotPassword(id: number): Promise<Auth>
    resetPassword(id: number, auth: Auth): Promise<Auth>
}