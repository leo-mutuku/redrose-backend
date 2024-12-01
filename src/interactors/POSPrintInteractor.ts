
import { inject, injectable } from "inversify";


export class POSPrintInteractor implements IPOSPrintInteractor {
    private repository: IPOSPrintRepository;
    constructor(@inject(INTERFACE_TYPE.POSPrintRepository) repository: IPOSPrintRepository) {
        this.repository = repository;
    }
    print(header: {}, body: [], footer: {}) {
        return this.repository.print(header, body, footer);
    }
}