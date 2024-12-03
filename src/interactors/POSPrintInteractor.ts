
import { inject, injectable } from "inversify";
import { IPOSPrintInteractor } from "../interfaces/IPOSPrintInteractor";
import { IPOSPrintExternalLib } from "../interfaces/IPOSExternalLib";
import { INTERFACE_TYPE } from "../utils";

@injectable()
export class POSPrintInteractor implements IPOSPrintInteractor {
    private extlib: IPOSPrintExternalLib;
    constructor(@inject(INTERFACE_TYPE.POSPrinterExternalLibrary) exlib: IPOSPrintExternalLib
    ) {
        this.extlib = exlib;
    }
    print(header: {}, body: [], footer: {}) {
        return this.extlib.print(header, body, footer);
    }
}