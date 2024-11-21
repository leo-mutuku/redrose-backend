import { injectable, inject } from "inversify";
import { IAuthInteractor } from "../../interfaces/administation/IAuthInteractor";
import { IAuthRepository } from "../../interfaces/administation/IAuthRepository";
import { INTERFACE_TYPE } from "../../utils";
import { AppError } from "../../utils/AppError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

@injectable()
export class AuthInteractor implements IAuthInteractor {
    private repository: IAuthRepository;
    constructor(@inject(INTERFACE_TYPE.AuthRepository) repository: IAuthRepository) {
        this.repository = repository;
    }
    async login(input: any): Promise<any> {
        const result = await this.repository.login(input)
        if (!result) {
            throw new AppError("Invalid username or password", 401)
        }
        // Compare provided password with the hashed password
        let resultPassword = result.password ? result.password : ""
        console.log(resultPassword)
        const isPasswordValid = bcrypt.compare(input.password, resultPassword);
        if (!isPasswordValid) {
            throw new AppError("Invalid username or password", 401);
        }
        // jwt token
        let userId = result.user_id ? result.user_id : "";
        const token = jwt.sign(
            { userId: userId, userName: result.username, roles: [] }, // Payload
            process.env.JWT_SECRET!,                 // Secret key from environment
            { expiresIn: "1h" }                      // Token expiration
        );
        return { result, token }

    }
    async forgotPassword(input: any): Promise<any> {
        const result = await this.repository.forgotPassword(input)
        return result
    }
    async resetPassword(input: any): Promise<any> {
        const result = await this.repository.resetPassword(input)
        return result
    }


}

