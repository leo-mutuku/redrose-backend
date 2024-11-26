export interface ISMSLibrary {
    sendBulky(to: string, message: string): Promise<any>
    sendSingle(to: string, message: string): Promise<any>
}