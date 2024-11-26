export interface ISMSInteractor {
    sendBulky(to: string, product: unknown);
    sendSingle(to: string, product: unknown);
}