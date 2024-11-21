import { Auth } from "../../entities/administration/Auth"
export interface IAuthRepository {
    login(auth: Auth): Promise<Auth>
    forgotPassword(username: string): Promise<Auth>
    resetPassword(auth: Auth): Promise<Auth>
}