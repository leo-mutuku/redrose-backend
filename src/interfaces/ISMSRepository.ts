export interface ISMSRepository {
    getPhoneNumbers(target: any): Promise<string[]>;
}

