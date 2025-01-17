CREATE OR REPLACE FUNCTION orders_clear_process(
    order JSON,      -- First JSON array for menu items
)
RETURNS text AS $$
DECLARE
    item JSON;
    pl_total NUMERIC(15, 2);
    pl_mpesa NUMERIC(15, 2);
    pl_cash NUMERIC(15, 2);
    pl_staff_id INT;
    pl_shift_id INT;
    pl_cashier_balance NUMERIC(15, 2);
    pl_cashier_cash_balance NUMERIC(15, 2);
    pl_cashier_mpesa_balance NUMERIC(15, 2);
    pl_cashier_txt_balance NUMERIC(15, 2);
    v_error_message text;  -- Variable to capture error messages
BEGIN
-- check if chashier account exists
    IF NOT EXISTS (SELECT 1 FROM cashiers WHERE staff_id = (order->>'staff_id')::INT) THEN
    RAISE EXCEPTION 'Cashier account does not exist';
    END IF;
    -- check if shift exists
    IF NOT EXISTS (SELECT 1 FROM active_shift WHERE shift_id = (order->>'shift_id')::INT) THEN
    RAISE EXCEPTION 'Shift does not exist';
    END IF;
    -- check if order exists and are in Posted status
    FOR item IN SELECT * FROM json_array_elements(order->'order')
    LOOP
    IF NOT EXISTS (SELECT 1 FROM sales_order_entry WHERE sales_order_entry_id = (item->>'sales_order_entry_id')::INT AND status = 'Posted') THEN
    RAISE EXCEPTION 'Bill does not exist or is not in Posted status for order entry ID: %', (item->>'sales_order_entry_id')::INT;
    END IF;
    END LOOP;
  -- get total amount
  SELECT SUM(total) INTO pl_total FROM json_array_elements(order->'order');
  -- get mpesa amount and cash amount
  SELECT SUM(CASE WHEN payment_method = 'MPESA' THEN amount ELSE 0 END) INTO pl_mpesa,
  SUM(CASE WHEN payment_method = 'CASH' THEN amount ELSE 0 END) INTO pl_cash FROM json_array_elements(order->'order');
  -- get staff id and shift id are in order json not cashier table, the attempt you making is in correct
  SELECT staff_id, shift_id INTO pl_staff_id, pl_shift_id FROM json_array_elements(order->'order') LIMIT 1;
  -- update cashier account balance cashier entries
  
  

