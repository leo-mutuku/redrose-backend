CREATE OR REPLACE FUNCTION purchase_order_process(
    order_details JSON      -- order details array
)
RETURNS text AS $$
DECLARE
    order_item JSON;
    pl_purchase_date DATE;
    pl_total NUMERIC(15, 2);
    pl_from_ VARCHAR(200);
    pl_from_id INT;
    pay_mode VARCHAR(200);
    pl_invoice_no VARCHAR(200);
    pl_bank_id INT;
    pl_cash_account_id INT;
    pl_order_details JSON;
    v_error_message text;  -- Variable to capture error messages

    pl_bank_balance NUMERIC(15, 2);
    pl_cash_balance NUMERIC(15, 2);
    pl_supplier_balance NUMERIC(15, 2);
    pl_vendor_balance NUMERIC(15, 2);
    pl_purchase_order_id INT;  -- To store the generated purchase order ID
BEGIN
    -- Insert the purchase order into the 'purchase_orders' table and capture the generated ID
    INSERT INTO purchase_orders (purchase_date, total, from_, from_id, pay_mode, invoice_no, bank_id, cash_account_id, created_at)
    VALUES (
        CURRENT_DATE, -- Assuming current date as the purchase date
        (order_details->>'total')::NUMERIC,
        order_details->>'from_',
        (order_details->>'from_id')::INT,
        order_details->>'pay_mode',
        order_details->>'invoice_no',
        (order_details->>'bank_id')::INT,
        (order_details->>'cash_account_id')::INT,
        NOW()
    )
    RETURNING purchase_order_id INTO pl_purchase_order_id;  -- Capture the generated purchase_order_id

    -- Process the order details
    FOR order_item IN SELECT * FROM json_array_elements(order_details)
    LOOP
        -- Extract values from order_item JSON
        pl_purchase_date := (order_item->>'purchase_date')::DATE;
        pl_total := (order_item->>'total')::NUMERIC;
        pl_from_ := order_item->>'from_';
        pl_from_id := (order_item->>'from_id')::INT;
        pay_mode := order_item->>'pay_mode';
        pl_invoice_no := order_item->>'invoice_no';
        pl_bank_id := (order_item->>'bank_id')::INT;
        pl_cash_account_id := (order_item->>'cash_account_id')::INT;
        pl_order_details := order_item->>'order_details';

        -- Check if the supplier or vendor exists
        IF pl_from_ = 'SUPPLIER' THEN
            IF NOT EXISTS (SELECT 1 FROM supplier WHERE supplier_id = pl_from_id) THEN
                RAISE EXCEPTION 'Supplier with ID % does not exist', pl_from_id;
            END IF;
        ELSIF pl_from_ = 'VENDOR' THEN
            IF NOT EXISTS (SELECT 1 FROM vendor WHERE vendor_id = pl_from_id) THEN
                RAISE EXCEPTION 'Vendor with ID % does not exist', pl_from_id;
            END IF;
        END IF;

        -- Handle CREDIT payment mode (skip bank or cash account updates)
        IF pay_mode = 'CREDIT' THEN
            pl_bank_id := NULL;
            pl_cash_account_id := NULL;
        END IF;

        -- Handle CASH payment mode (check if bank_id or cash_account_id is NULL)
        IF pay_mode = 'CASH' THEN
            IF pl_bank_id IS NULL AND pl_cash_account_id IS NULL THEN
                RAISE EXCEPTION 'Bank or Cash Account is required for CASH payment mode';
            END IF;
        END IF;

        -- Update bank or cash account balances for payment
        IF pay_mode = 'CASH' THEN
            IF pl_bank_id > 0 THEN
                -- Get current balance of the bank account
                SELECT balance INTO pl_bank_balance FROM bank_account WHERE id = pl_bank_id;
                UPDATE bank_account SET balance = balance - pl_total WHERE id = pl_bank_id;
                -- Insert into bank_entries table
                INSERT INTO bank_entries (bank_id, balance, description, debit, credit, created_at)
                VALUES (pl_bank_id, pl_bank_balance - pl_total, 'Purchase Order', pl_total, 0, NOW());
            ELSE
                -- Get current balance of the cash account
                SELECT balance INTO pl_cash_balance FROM cash_account WHERE id = pl_cash_account_id;
                UPDATE cash_account SET balance = balance - pl_total WHERE id = pl_cash_account_id;
                -- Insert into cash_entries table
                INSERT INTO cash_entries (cash_account_id, balance, description, debit, credit, created_at)
                VALUES (pl_cash_account_id, pl_cash_balance - pl_total, 'Purchase Order', pl_total, 0, NOW());
            END IF;
        END IF;

        -- Update supplier or vendor balances
        IF pl_from_ = 'SUPPLIER' THEN
            -- Get current balance of the supplier
            SELECT balance INTO pl_supplier_balance FROM supplier WHERE id = pl_from_id;
            UPDATE supplier SET balance = balance - pl_total WHERE id = pl_from_id;
            -- Insert into supplier_entries table
            INSERT INTO supplier_entries (supplier_id, balance, description, debit, credit, created_at)
            VALUES (pl_from_id, pl_supplier_balance - pl_total, 'Purchase Order', pl_total, 0, NOW());
        ELSE
            -- Get current balance of the vendor
            SELECT balance INTO pl_vendor_balance FROM vendor WHERE id = pl_from_id;
            UPDATE vendor SET balance = balance - pl_total WHERE id = pl_from_id;
            -- Insert into vendor_entries table
            INSERT INTO vendor_entries (vendor_id, balance, description, debit, credit, created_at)
            VALUES (pl_from_id, pl_vendor_balance - pl_total, 'Purchase Order', pl_total, 0, NOW());
        END IF;

        -- Insert into purchase_order_items and purchase_order_details tables
        INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price, total, created_at)
        VALUES (
            pl_purchase_order_id,  -- Use the generated purchase_order_id
            (order_item->>'product_id')::INT, 
            (order_item->>'quantity')::INT, 
            (order_item->>'unit_price')::NUMERIC, 
            (order_item->>'total')::NUMERIC, 
            NOW()
        );

        INSERT INTO purchase_order_details (purchase_order_id, product_id, quantity, unit_price, total, created_at)
        VALUES (
            pl_purchase_order_id,  -- Use the generated purchase_order_id
            (order_item->>'product_id')::INT, 
            (order_item->>'quantity')::INT, 
            (order_item->>'unit_price')::NUMERIC, 
            (order_item->>'total')::NUMERIC, 
            NOW()
        );

    END LOOP;

    -- Return success message
    RETURN 'Purchase order processed successfully';

EXCEPTION
    WHEN OTHERS THEN
        -- Rollback the transaction on error
        ROLLBACK;
        -- Capture error message
        v_error_message := SQLERRM;
        -- Raise an exception with the error message
        RAISE EXCEPTION '%', v_error_message;
END;
$$ LANGUAGE plpgsql;



    -- call the function
    SELECT purchase_order('{"order_details": [{"purchase_date": "2023-03-20", "total": 100, "from_": "SUPPLIER", "from_id": 1, "pay_mode": "CASH", "invoice_no": "INV-001", "bank_id": 1, "cash_account_id": 1, "order_details": [{"product_id": 1, "quantity": 10, "unit_price": 10, "total": 100}]}]}', 1);




    