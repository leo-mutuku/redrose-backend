export interface ISMSInteractor {
    sendBulky(target: any, message: string);
    sendSingle(to: string, message: unknown);
}