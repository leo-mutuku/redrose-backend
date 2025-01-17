import {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
    BreakLine,
} from "node-thermal-printer";
import { AppError } from "../utils/AppError";

export interface PrinterConfig {
    type: PrinterTypes; // Printer type
    interface: string; // Connection interface
    options?: {
        timeout?: number; // Timeout for connection
    };
    width?: number; // Characters per line
    characterSet?: CharacterSet; // Character set
    breakLine?: BreakLine; // Break line mode
    removeSpecialCharacters?: boolean; // Remove special characters
    lineCharacter?: string; // Character for drawing lines
}

export interface ReceiptSection {
    header: Record<string, string | number>;
    body: Array<{
        item_name: string;
        quantity: number;
        cost_per_item: number;
        total: number;
    }>;
    footer: Record<string, string | number>;
}

export class POSPrinter {
    private printer: ThermalPrinter;

    constructor(config: PrinterConfig) {
        this.printer = new ThermalPrinter({
            type: config.type,
            interface: config.interface,
            options: config.options || { timeout: 1000 },
            width: config.width || 48,
            characterSet: config.characterSet || CharacterSet.PC852_LATIN2,
            breakLine: config.breakLine || BreakLine.WORD,
            removeSpecialCharacters: config.removeSpecialCharacters || false,
            lineCharacter: config.lineCharacter || "-",
        });
    }

    public async printReceipt(data: ReceiptSection): Promise<void> {
        try {
            const isConnected = await this.printer.isPrinterConnected();
            if (!isConnected) {
                throw new AppError("Printer is not connected");
            }

            this.printer.clear();
            this.formatHeader(data.header);
            this.formatBody(data.body);
            this.formatFooter(data.footer);

            await this.printer.execute();
            // this.printer.disconnect();
            console.log("Receipt printed successfully.");
        } catch (error) {
            console.error("Error printing receipt:", error);
        }
    }

    private formatHeader(header: Record<string, string | number>): void {
        this.printer.drawLine("*");
        this.printer.leftRight("RED ROSE", "CASH SALE");
        this.printer.leftRight("PO BOX 238 MERU", `${header["date"]}`);
        this.printer.println("redrose@gmail.com");
        this.printer.println("Dealers in: All types of cereals, Animal feeds");
        this.printer.println("");
        this.printer.leftRight("Tel: 0793306004", "PIN PIN P052132641M");
        this.printer.drawLine();
        this.printer.leftRight(
            `DATE: ${header["date"]}`,
            `BILL.NO: ${header["sales_order_number"]}`
        );
        this.printer.drawLine();
    }

    private formatBody(
        body: Array<{ item_name: string; quantity: number; cost_per_item: number; total: number }>
    ): void {
        this.printer.table(["Qty.", "@Kshs.", "Total(Kshs.)."]);
        this.printer.drawLine();
        body.forEach((item) => {
            this.printer.println(item.item_name);
            this.printer.table([`${item.quantity}`, `${item.cost_per_item}`, `${item.total}`]);
            this.printer.println("");
        });
        this.printer.drawLine();
    }

    private formatFooter(footer: Record<string, string | number>): void {
        this.printer.table(["", `TAX (${footer["vat_rate"]}% VAT)`, `${footer["vat_value"]}`]);
        this.printer.table(["", "Sub-Total", `${footer["sub_total"]}`]);
        this.printer.table(["", "Total (Kshs.)", `${footer["total"]}`]);
        this.printer.drawLine();
        this.printer.println("");
        this.printer.println(`Customer : ${footer["customer_name"]}`);
        this.printer.leftRight(
            `Served By: ${footer["served_by"]}`,
            `Sales Person: ${footer["sales_person"]}`
        );
        this.printer.println("Goods once sold cannot be returned");
        this.printer.println("");
    }
}
