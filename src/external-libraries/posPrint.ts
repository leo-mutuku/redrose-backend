import sqlite3 from 'sqlite3';
import {
    ThermalPrinter,
    PrinterTypes,
    CharacterSet,
    BreakLine,
} from 'node-thermal-printer';

// Define types for the header, body, and footer
interface Item {
    quantity: number;
    name: string;
    price: number;
    total_price: number;
}

interface ReceiptHeader {
    date: string;
    sales_order_id: string;
    total: number;
    vat: number;
    cat: number;
    staff_name: string;
    tv: number;
}

interface PrintJob {
    id: number;
    header: string;
    body: string;
    footer: string;
    location: string;
    status: string;
}

// Open or create the database
const db = new sqlite3.Database('print_jobs.db');

// Create the print_jobs table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS print_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    header TEXT,
    body TEXT,
    footer TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending'
)`);

const printer = new ThermalPrinter({
    type: PrinterTypes.STAR,
    interface: 'tcp://192.168.88.7', // Printer IP or serial port
    options: { timeout: 1000 },
    width: 48,
    characterSet: CharacterSet.PC852_LATIN2,
    breakLine: BreakLine.WORD,
    removeSpecialCharacters: false,
    lineCharacter: '-',
});

class SalesReceipt {
    async receipt(header: ReceiptHeader, body: Item[]): Promise<void> {
        const isConnected = await printer.isPrinterConnected();

        if (isConnected) {
            // If the printer is connected, print the job directly
            printer.clear();
            printer.drawLine('*');
            printer.leftRight('RED ROSE HOTEL', 'CASH RECEIPT');
            printer.leftRight('KRA PIN: ', 'A004868340G');
            printer.println('Opposite Kensiliver Bus Station Maua meru');
            printer.println('Tel: 0718147498');
            printer.leftRight(`BILL NO: ${header.sales_order_id} `, `Date: ${header.date}`);
            printer.println('Location: MAIN KITCHEN');
            printer.println('');
            printer.println('CUSTOMER RECEIPT');
            printer.drawLine();
            printer.leftRight(`BILL NO: ${header.sales_order_id}`, `DATE: ${header.date}`);
            printer.table(['Qty.', 'Item', '@Kshs.', 'Total(Kshs.)']);
            printer.drawLine();
            body.forEach((item) => {
                printer.table([`${item.quantity}`, `${item.name}`, `${item.price}`, `${item.total_price}`]);
                printer.println('');
            });
            printer.drawLine();
            printer.leftRight('BUY GOODS : 952262', `TTL KSHs: ${header.tv}`);
            printer.drawLine();
            printer.table(['', `VAT 16% `, `${header.vat}`]);
            printer.table(['', `CAT 2%`, `${header.cat}`]);
            printer.drawLine();
            printer.println('');
            printer.leftRight(`Served By: ${header.staff_name}`, '');
            printer.println('Goods once sold cannot be returned');
            printer.println('');
            printer.println('');
            printer.println('');
            printer.println('');
            printer.println('');
            printer.println('');
            printer.setTextNormal();

            try {
                await printer.execute();
            } catch (error) {
                console.error('Print error:', error);
            }
        } else {
            // If the printer is not connected, save the job to the database
            db.run(
                `INSERT INTO print_jobs (header, body, footer,location, status) VALUES (?, ?, ?,?, ?)`,
                [JSON.stringify(header), JSON.stringify(body), '', 'Customer', 'pending'],
                function (err) {
                    if (err) {
                        console.error('Error saving print job to database:', err);
                    } else {
                        console.log('Print job queued in the database.');
                        db.all('SELECT * FROM print_jobs WHERE status = "pending" AND location="Customer"', [], async (err, rows) => {
                            console.log(rows)

                        })
                    }
                }
            );
        }
    }

    // Function to process queued print jobs
    async processQueuedJobs(): Promise<void> {
        const isConnected = await printer.isPrinterConnected();

        if (isConnected) {
            db.all('SELECT * FROM print_jobs WHERE status = "pending" AND location = "Customer"', [], async (err, rows) => {
                if (err) {
                    console.error('Error retrieving queued jobs:', err);
                    return;
                }

                // Iterate through the rows as PrintJob[] type
                for (const job of rows as PrintJob[]) {
                    const header: ReceiptHeader = JSON.parse(job.header); // Parse header as ReceiptHeader
                    const body: Item[] = JSON.parse(job.body); // Parse body as Item[]

                    // Print the queued job
                    await this.receipt(header, body);

                    // After printing, update the status of the job to 'printed'
                    db.run('UPDATE print_jobs SET status = "printed" WHERE id = ? AND location ="Customer"', [job.id], (err) => {
                        if (err) {
                            console.error('Error updating job status:', err);
                        }
                    });
                }
            });
        } else {
            console.log('Printer is not connected. Retrying...');
        }
    }
}

export default SalesReceipt;
