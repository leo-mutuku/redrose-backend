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
        printer.leftRight("KRA PIN: ", `A004868340G`);
        printer.println("Opposite Kensiliver Bus Station Maua Meru");
        printer.println("Tel: 0718147498");
        printer.leftRight(`BILL NO: ${header.sales_order_id} `, `Date: ${header.date}`);

        printer.println('Location: RESTAURANT');
        printer.println("");

        printer.println("CUSTOMER ORDER RECEIPT");

        printer.drawLine();

        printer.leftRight(
            `BILL NO: ${header.sales_order_id}`,
            `DATE: ${header.date}`
        );
        printer.drawLine();
        printer.table([`Qty.`, `Item`, `@Kshs.`, `Total(Kshs.).`]);
        printer.drawLine();
        body.map((item) => {
            printer.println(``);
            printer.table([
                `${item.quantity}`,
                `${item.name}`,
                `${item.price}`,
                `${item.total_price}`,
            ]);
            printer.println("");
        });
        printer.drawLine();
        printer.println("BUY GOODS : 952262");
        printer.drawLine();

        printer.table(["", `VAT 16% `, `${header.vat}`]);
        printer.table(["", `CAT 2%`, `${header.cat}`]);
        printer.table(["", `Total (Kshs.)`, `${header.tv}`]);

        printer.drawLine();
        printer.println("");
        printer.leftRight(
            `Served By: ${header.staff_name}`,
            ` `
        );
        printer.println("Goods once sold cannot be returned");
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
