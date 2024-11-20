import { injectable, inject } from "inversify";
import { IAuthInteractor } from "../../interfaces/administation/IAuthInteractor";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";
import { INTERFACE_TYPE } from "../../utils";

@injectable()
export class AuthInteractor implements IAuthInteractor {
    private repository: IAuthRepository;
    constructor(@inject(INTERFACE_TYPE.AuthRepository) repository: IAuthRepository) {
        this.repository = repository;
    }
    async login(input: any): Promise<any> {
        try {
            const result = await this.repository.login(input)
            return result

        } catch (error) {
            throw new Error("Error logging in" + error);

        }
    }
    async forgotPassword(input: any): Promise<any> {
        try {
            const result = await this.repository.forgotPassword(input)
            return result

        } catch (error) {
            throw new Error("Error logging in" + error);
        }
    }
    async resetPassword(input: any): Promise<any> {
        try {
            const result = await this.repository.resetPassword(input)
            return result

        } catch (error) {
            throw new Error("Error logging in" + error);

        }
    }


}

