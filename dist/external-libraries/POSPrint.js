"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSPrinter = void 0;
const node_thermal_printer_1 = require("node-thermal-printer");
const AppError_1 = require("../utils/AppError");
class POSPrinter {
    constructor(config) {
        this.printer = new node_thermal_printer_1.ThermalPrinter({
            type: config.type,
            interface: config.interface,
            options: config.options || { timeout: 1000 },
            width: config.width || 48,
            characterSet: config.characterSet || node_thermal_printer_1.CharacterSet.PC852_LATIN2,
            breakLine: config.breakLine || node_thermal_printer_1.BreakLine.WORD,
            removeSpecialCharacters: config.removeSpecialCharacters || false,
            lineCharacter: config.lineCharacter || "-",
        });
    }
    printReceipt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isConnected = yield this.printer.isPrinterConnected();
                if (!isConnected) {
                    throw new AppError_1.AppError("Printer is not connected");
                }
                this.printer.clear();
                this.formatHeader(data.header);
                this.formatBody(data.body);
                this.formatFooter(data.footer);
                yield this.printer.execute();
                // this.printer.disconnect();
                console.log("Receipt printed successfully.");
            }
            catch (error) {
                console.error("Error printing receipt:", error);
            }
        });
    }
    formatHeader(header) {
        this.printer.drawLine("*");
        this.printer.leftRight("NOVENA MAIZE MILLER LTD", "CASH SALE");
        this.printer.leftRight("PO BOX 238 MERU", `${header["date"]}`);
        this.printer.println("novenamaizemillerltd@gmail.com");
        this.printer.println("Dealers in: All types of cereals, Animal feeds");
        this.printer.println("");
        this.printer.leftRight("Tel: 0793306004", "PIN PIN P052132641M");
        this.printer.drawLine();
        this.printer.leftRight(`BATCH NO: ${header["batch_number"]}`, `SALES.ORDER.NO: ${header["sales_order_number"]}`);
        this.printer.drawLine();
    }
    formatBody(body) {
        this.printer.table(["Qty.", "@Kshs.", "Total(Kshs.)."]);
        this.printer.drawLine();
        body.forEach((item) => {
            this.printer.println(item.item_name);
            this.printer.table([`${item.quantity}`, `${item.cost_per_item}`, `${item.total}`]);
            this.printer.println("");
        });
        this.printer.drawLine();
    }
    formatFooter(footer) {
        this.printer.table(["", `TAX (${footer["vat_rate"]}% VAT)`, `${footer["vat_value"]}`]);
        this.printer.table(["", "Sub-Total", `${footer["sub_total"]}`]);
        this.printer.table(["", "Total (Kshs.)", `${footer["total"]}`]);
        this.printer.drawLine();
        this.printer.println("");
        this.printer.println(`Customer : ${footer["customer_name"]}`);
        this.printer.leftRight(`Served By: ${footer["served_by"]}`, `Sales Person: ${footer["sales_person"]}`);
        this.printer.println("Goods once sold cannot be returned");
        this.printer.println("");
    }
}
exports.POSPrinter = POSPrinter;
