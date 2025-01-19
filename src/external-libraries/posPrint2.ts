import {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
    BreakLine,
} from "node-thermal-printer";

const printer = new ThermalPrinter({
    type: PrinterTypes.STAR, // 'star' or 'epson'
    interface: "tcp://192.168.88.7", // Printer IP or serial port
    options: {
        timeout: 1000,
    },
    width: 48, // Number of characters in one line - default: 48
    characterSet: CharacterSet.PC852_LATIN2, // Character set - default: SLOVENIA
    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "-", // Use custom character for drawing lines - default: -
});
class CustomerReceipt {
    async receipt(header, body, footer) {
        let isConnected = await printer.isPrinterConnected(); // Check if printer is connected, return bool of status
        printer.clear();
        printer.drawLine("*");
        printer.leftRight("RED ROSE HOTEL", "CASH RECEIPT");
        printer.println("Opposite Kensiliver Bus Station Maua Meru");
        printer.println("Tel: 0720220892/0718147498");
        printer.leftRight("BILL NO: ", `Date: ${header.date}`);

        printer.println('Location: MAIN KITCHEN');
        printer.println("");

        printer.println("CUSTOMER ORDER RECEIPT");

        printer.drawLine();

        printer.leftRight(
            `BATCH NO: ${header.batch_number}`,
            `SALES.ORDER.NO: ${header.sales_order_number}`
        );
        printer.drawLine();
        printer.table([`Qty.`, `@Kshs.`, `Total(Kshs.).`]);
        printer.drawLine();
        body.map((item) => {
            printer.println(`${item.item_name}`);
            printer.table([
                `${item.quantity}`,
                `${item.cost_per_item}`,
                `${item.total}`,
            ]);
            printer.println("");
        });
        printer.drawLine();
        printer.table(["", `VAT `, `${footer.vat_value}`]);
        printer.table(["", `CAT`, `${footer.sub_total}`]);
        printer.table(["", `Total (Kshs.)`, `${footer.total}`]);

        printer.drawLine();
        printer.println("");
        printer.println(`Customer : ${footer.customer_name}`);
        printer.leftRight(
            `Served By: ${footer.served_by}`,
            `: ${footer.sales_person}`
        );
        printer.println("Goods once sold cannot be returned");
        printer.println("");
        printer.println("");
        printer.println("");
        printer.println("");
        printer.println("");
        printer.println("");
        printer.setTextNormal();
        try {
            await printer.execute();


            // console.log("Print success.");
        } catch (error) {
            // console.error("Print error:", error);
        }
    }
}

export default CustomerReceipt;
