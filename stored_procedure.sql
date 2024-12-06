
--Food processing - procedure to get kitchen setup and linkage between store_item and menu - item

CREATE OR REPLACE FUNCTION get_kitchen_ingredients_by_setup_id(
    food_items JSON
)
RETURNS TABLE(
    ingredients_id INT,
    store_item_id INT,
    quantity NUMERIC(15, 2)-- Updated return type for quantity
) AS $$
DECLARE
    item JSON;
    kitchen_setup_id INT;
    qty NUMERIC(15, 2);
    ingredients_found INT;
BEGIN
--Loop through the JSON array to process each item
    FOR item IN
SELECT * FROM json_array_elements(food_items)-- Get each JSON element
LOOP
--Extract the kitchen_setup_id and quantity from the JSON object
kitchen_setup_id:= (item ->> 'kitchen_setup_id'):: INT;
qty:= (item ->> 'quantity'):: NUMERIC;

--Check if there are any ingredients matching the kitchen_setup_id
        SELECT COUNT(*)
        INTO ingredients_found
        FROM kitchen_ingredients ki
        WHERE ki.ingredients_id = kitchen_setup_id;

--If no ingredients found, raise an exception
        IF ingredients_found = 0 THEN
            RAISE EXCEPTION 'No ingredients found for kitchen_setup_id: %', kitchen_setup_id;
        END IF;

--Select the ingredients, multiplying quantity by the passed qty
        RETURN QUERY
SELECT
ki.ingredients_id,
    ki.store_item_id,
    ki.quantity * qty AS quantity-- Multiply the quantity from the table by the qty
FROM
            kitchen_ingredients ki
WHERE
ki.ingredients_id = kitchen_setup_id;
    END LOOP;

--If no results, return empty
RETURN;
END;
$$ LANGUAGE plpgsql;




--Food processing - procedure to update store_item and item_tracking

CREATE OR REPLACE FUNCTION update_store_item_quantities(
    food_items JSON
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_store_item_id INT; --PL / pgSQL variable to store the store_item_id
    pl_qty NUMERIC(15, 2); --PL / pgSQL variable to store the quantity
    current_quantity NUMERIC(15, 2); --Variable to store the current quantity from store_item
    new_quantity NUMERIC(15, 2); --Variable to store the new quantity after update
BEGIN
--Loop through the JSON array to process each item
    FOR item IN
SELECT * FROM json_array_elements(food_items)-- Get each JSON element
LOOP
--Extract store_item_id and quantity from the JSON object
pl_store_item_id:= (item ->> 'store_item_id'):: INT; --Assign to PL / pgSQL variable
pl_qty:= (item ->> 'quantity'):: NUMERIC; --Assign to PL / pgSQL variable

--Lock the row for the store_item_id to prevent race conditions
        FOR current_quantity IN 
            SELECT si.quantity-- Explicitly qualify the column name
            FROM store_item si-- Explicitly qualify the table name
            WHERE si.store_item_id = pl_store_item_id-- Use the PL / pgSQL variable
            FOR UPDATE-- Row - level lock
LOOP
--Check if the new quantity after update would be negative
            IF current_quantity - pl_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for store_item_id % would be negative', pl_store_item_id;
ELSE
--Calculate the new quantity after subtraction
new_quantity:= current_quantity - pl_qty;

--Update the store_item quantity with the new value
                UPDATE store_item
                SET quantity = new_quantity
                WHERE store_item_id = pl_store_item_id;

--Insert into item_tracking table to track the change
                INSERT INTO item_tracking(store_item_id, current_quantity, new_quantity, reason)
VALUES(pl_store_item_id, current_quantity, new_quantity, 'Food processing');
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


--Food processing - Procedure to update menu_item and menu tracking

CREATE OR REPLACE FUNCTION update_menu_item_quantities(
    food_items JSON
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_menu_item_id INT;
    pl_qty NUMERIC(15,2);
    current_quantity NUMERIC(15,2);
    new_quantity NUMERIC(15,2);
BEGIN
    -- Sort the JSON input by menu_item_id for consistent locking order
    FOR item IN
        SELECT * FROM json_array_elements(food_items)
        ORDER BY (item->>'menu_item_id')::INT  -- Sort by menu_item_id
    LOOP
        pl_menu_item_id := (item->>'menu_item_id')::INT;
        pl_qty := (item->>'quantity')::NUMERIC;

        FOR current_quantity IN
            SELECT mi.quantity
            FROM menu_item mi
            WHERE mi.menu_item_id = pl_menu_item_id
            FOR UPDATE
        LOOP
            IF pl_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for menu_item_id % negative update not allowed', pl_menu_item_id;
            ELSE
                new_quantity := current_quantity + pl_qty;

                UPDATE menu_item
                SET quantity = new_quantity
                WHERE menu_item_id = pl_menu_item_id;

                INSERT INTO menu_tracking (menu_item_id, current_quantity, new_quantity, reason)
                VALUES (pl_menu_item_id, current_quantity, new_quantity, 'Food processing');
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;



---------------




CREATE OR REPLACE FUNCTION update_supplier_balance(p_json_input JSONB)
RETURNS VOID AS $$
DECLARE
    supplier_id INT;
    amount NUMERIC;
    description TEXT;
    is_credit BOOLEAN;
    current_balance NUMERIC;
    new_balance NUMERIC;
BEGIN
    -- Extract values from the JSON object
    supplier_id := (p_json_input->>'supplier_id')::INT;
    amount := (p_json_input->>'amount')::NUMERIC;
    description := p_json_input->>'description';
    is_credit := (p_json_input->>'is_credit')::BOOLEAN;

    -- Lock the supplier row and get the current balance
    SELECT balance INTO current_balance
    FROM supplier
    WHERE id = supplier_id
    FOR UPDATE; -- Acquires a row-level lock

    -- Calculate the new balance
    IF is_credit THEN
        new_balance := current_balance + amount;
    ELSE
        new_balance := current_balance - amount;
    END IF;

    -- Update the supplier's balance
    UPDATE supplier
    SET balance = new_balance
    WHERE id = supplier_id;

    -- Insert the entry into supplier_entries
    INSERT INTO supplier_entries (supplier_id, debit, credit, description, balance, created_at)
    VALUES (
        supplier_id,
        CASE WHEN is_credit THEN 0 ELSE amount END,
        CASE WHEN is_credit THEN amount ELSE 0 END,
        description,
        new_balance,
        NOW()
    );
END;
$$ LANGUAGE plpgsql;

--trigger to update store_item and menu_item quantities
SELECT update_menu_item_quantities('[{"menu_item_id": 9, "quantity": 100}]':: json);








------------------------------------------- End of food processing procedures---------------------------


    --------------------------------------------Start of purchase procedures--------------------------------

-- procedure to update supplier entries 
-- supplier entries table   credit, debit balance description
SELECT update_supplier_entries('{"supplier_id":100, txn_type:"credit" , "amount":2000}':: json);

CREATE OR REPLACE FUNCTION update_supplier_balance(
    p_supplier_id INT,
    p_amount NUMERIC,
    p_description TEXT,
    p_is_credit BOOLEAN
)
RETURNS VOID AS $$
DECLARE
    v_current_balance NUMERIC;
    v_new_balance NUMERIC;
BEGIN
    -- Get the current balance of the supplier
    SELECT balance INTO v_current_balance
    FROM supplier
    WHERE id = p_supplier_id;

    IF v_current_balance IS NULL THEN
        RAISE EXCEPTION 'Supplier with ID % does not exist', p_supplier_id;
    END IF;

    -- Calculate the new balance
    IF p_is_credit THEN
        v_new_balance := v_current_balance + p_amount;
    ELSE
        v_new_balance := v_current_balance - p_amount;
    END IF;

    -- Update the supplier's balance
    UPDATE supplier
    SET balance = v_new_balance
    WHERE id = p_supplier_id;

    -- Insert the entry into supplier_entries
    INSERT INTO supplier_entries (supplier_id, debit, credit, description, balance, created_at)
    VALUES (
        p_supplier_id,
        CASE WHEN p_is_credit THEN 0 ELSE p_amount END,
        CASE WHEN p_is_credit THEN p_amount ELSE 0 END,
        p_description,
        v_new_balance,
        NOW()
    );

END;
$$ LANGUAGE plpgsql;



--- Sales procedure to update sales order 


--sales person balance/ waiter

CREATE OR REPLACE FUNCTION update_waitstaff_balance(
    p_waitstaff_id INT,
    p_amount NUMERIC,
    p_description TEXT,
    p_is_credit BOOLEAN
)
RETURNS VOID AS $$
DECLARE
    v_current_balance NUMERIC;
    v_new_balance NUMERIC;
BEGIN
    -- Get the current balance of the waitstaff
    SELECT balance INTO v_current_balance
    FROM waitstaff
    WHERE id = p_waitstaff_id;

    IF v_current_balance IS NULL THEN
        RAISE EXCEPTION 'Supplier with ID % does not exist', p_waitstaff_id;
    END IF;

    -- Calculate the new balance
    IF p_is_credit THEN
        v_new_balance := v_current_balance + p_amount;
    ELSE
        v_new_balance := v_current_balance - p_amount;
    END IF;

    -- Update the waitstaff's balance
    UPDATE waitstaff
    SET balance = v_new_balance
    WHERE id = p_supplier_id;

    -- Insert the entry into waitstaff_entries
    INSERT INTO supplier_entries (supplier_id, debit, credit, description, balance, created_at)
    VALUES (
        p_waitsatff_id,
        CASE WHEN p_is_credit THEN 0 ELSE p_amount END,
        CASE WHEN p_is_credit THEN p_amount ELSE 0 END,
        p_description,
        v_new_balance,
        NOW()
    );

END;
$$ LANGUAGE plpgsql;
