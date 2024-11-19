import { Auth } from "../../entities/administration/Auth";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";

export class AUthRepository implements IAuthRepository {
    login(auth: Auth): Promise<Auth> {
        throw new Error("Method not implemented.");
    }
    register(auth: Auth): Promise<Auth> {
        throw new Error("Method not implemented.");
    }
    forgotPassword(id: number): Promise<Auth> {
        throw new Error("Method not implemented.");
    }
    resetPassword(id: number, auth: Auth): Promise<Auth> {
        throw new Error("Method not implemented.");
    }

}
