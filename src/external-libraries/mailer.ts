import { injectable } from "inversify";
import { IMailer } from "../interfaces/IMailerInteractor";

@injectable()
export class Mailer implements IMailer {
  SendEmail(to: string, product: unknown) {
    // node mailer implimentation
    console.log("sending email");
    return true;
  }
}
