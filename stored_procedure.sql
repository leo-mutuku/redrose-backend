
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
    pl_source_type VARCHAR(200);
    current_quantity NUMERIC(15,2);
    new_quantity NUMERIC(15,2);
BEGIN
    -- Sort the JSON input by menu_item_id for consistent locking order
    FOR item IN
        SELECT * FROM json_array_elements(food_items)
        ORDER BY (item->>'menu_item_id')::INT  -- Sort by menu_item_id
    LOOP
        pl_menu_item_id := (item->>'menu_item_id')::INT;
        pl_source_type :=(item->>'source_type')::VARCHAR;
        pl_qty := (item->>'quantity')::NUMERIC;

        -- Select and update the quantity in a single statement
        -- This uses a subquery to lock and select the current quantity, then updates it
        WITH current_data AS (
            SELECT quantity
            FROM menu_item
            WHERE menu_item_id = pl_menu_item_id
            FOR UPDATE
        )
        UPDATE menu_item
        SET quantity = current_data.quantity + pl_qty
        FROM current_data
        WHERE menu_item.menu_item_id = pl_menu_item_id
        RETURNING menu_item.quantity AS new_quantity, current_data.quantity AS current_quantity;

        -- Insert into tracking after updating
        INSERT INTO menu_tracking (menu_item_id, current_quantity, new_quantity, reason)
        VALUES (pl_menu_item_id, current_quantity, new_quantity, 'Food processing');
        
        -- Raise an exception if quantity is negative
        IF pl_qty < 0 THEN
            RAISE EXCEPTION 'Quantity for menu_item_id % negative update not allowed', pl_menu_item_id;
        END IF;
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




  


------- Store transfer
CREATE OR REPLACE FUNCTION store_transfer_procedure(
    store_item JSON
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_store_item_id INT; -- Variable to store store_item_id
    pl_destination_store_item_id INT; -- Variable to store destination_store_item_id
    pl_qty NUMERIC(15, 4); -- Variable to store quantity
    pl_transfer_type VARCHAR(200); -- Variable to store transfer_type
    s_current_quantity NUMERIC(15, 4); -- Current quantity in store_item
    s_new_quantity NUMERIC(15, 2); -- New quantity in store_item
    des_current_quantity NUMERIC(15, 4); -- Current quantity in destination store
    des_new_quantity NUMERIC(15, 4); -- New quantity in destination store
    tracking_reason VARCHAR(255); -- Reason for tracking
    des_table_name VARCHAR(50); -- Destination store table name
    tracking_table_name VARCHAR(50); -- Tracking table name
BEGIN
    -- Loop through the JSON array to process each item
    FOR item IN
        SELECT * FROM json_array_elements(store_item)
    LOOP
        -- Extract store_item_id and quantity
        pl_store_item_id := (item ->> 'store_item_id')::INT;
        pl_qty := (item ->> 'quantity')::NUMERIC;
        pl_transfer_type := (item ->> 'transfer_type')::VARCHAR;
        pl_destination_store_item_id := (item ->> 'destination_store_item_id')::INT;

        -- Lock and check quantity in store_item
        SELECT quantity
        INTO s_current_quantity
        FROM store_item
        WHERE store_item_id = pl_store_item_id
        FOR UPDATE;

        -- Check if there is enough quantity in store_item
        IF s_current_quantity - pl_qty < 0 THEN
            RAISE EXCEPTION 'Quantity for store_item_id % in store_item would be negative', pl_store_item_id;
        ELSE
            -- Update store_item
            s_new_quantity := s_current_quantity - pl_qty;
            UPDATE store_item
            SET quantity = s_new_quantity
            WHERE store_item_id = pl_store_item_id;

            -- Log in item_tracking
            INSERT INTO item_tracking(store_item_id, current_quantity, new_quantity, reason)
            VALUES (pl_store_item_id, s_current_quantity, s_new_quantity, 'Transfer to ' || pl_transfer_type);
        END IF;

        -- Determine the destination store and tracking table based on transfer type
        IF pl_transfer_type = 'KITCHEN' THEN
            des_table_name := 'kitchen_store';
            tracking_table_name := 'hot_kitchen_tracking';
            tracking_reason := 'Transfer from store to kitchen';
        ELSIF pl_transfer_type = 'RESTAURANT' THEN
            des_table_name := 'restaurant_store';
            tracking_table_name := 'restaurant_tracking';
            tracking_reason := 'Transfer from store to restaurant';
        ELSE
            RAISE EXCEPTION 'Invalid transfer type: %', pl_transfer_type;
        END IF;

        -- Lock and update destination store_item
        EXECUTE format('SELECT quantity FROM %I WHERE store_item_id = $1 FOR UPDATE', des_table_name)
        INTO des_current_quantity
        USING pl_destination_store_item_id;

        -- Update or insert into destination store
        des_new_quantity := COALESCE(des_current_quantity, 0) + pl_qty;

        IF des_current_quantity IS NULL THEN
            EXECUTE format('INSERT INTO %I (store_item_id, quantity) VALUES ($1, $2)', des_table_name)
            USING pl_destination_store_item_id, pl_qty;
        ELSE
            EXECUTE format('UPDATE %I SET quantity = $1 WHERE store_item_id = $2', des_table_name)
            USING des_new_quantity, pl_destination_store_item_id;
        END IF;

        -- Log in destination tracking table
        EXECUTE format('INSERT INTO %I (store_item_id, current_quantity, new_quantity, reason) VALUES ($1, $2, $3, $4)', tracking_table_name)
        USING pl_destination_store_item_id, COALESCE(des_current_quantity, 0), des_new_quantity, tracking_reason;

    END LOOP;
END;
$$ LANGUAGE plpgsql;









------------------------------------------STORE ISSUE PROCEDURES----------------------------------------
CREATE OR REPLACE FUNCTION process_store_issue(
    issue_date DATE,
    description TEXT,
    issued_by INT,
    created_by INT,
    issue_list JSONB
)
RETURNS TABLE (
    store_issue_header_id INT,
    issue_date_out DATE,
    description_out TEXT,
    issued_by_out INT,
    created_by_out INT
) AS $$
DECLARE
    header_id INT;
    item JSONB;
    initial_quantity NUMERIC;
    final_quantity NUMERIC;
BEGIN
    -- Insert into store_issue_header
    INSERT INTO store_issue_header (issue_date, description, issued_by, created_by)
    VALUES (issue_date, description, issued_by, created_by)
    RETURNING store_issue_header_id, issue_date, description, issued_by, created_by
    INTO header_id, issue_date_out, description_out, issued_by_out, created_by_out;

    -- Loop through the issue_list array
    FOR item IN SELECT * FROM jsonb_array_elements(issue_list)
    LOOP
        -- Fetch the current quantity for `store_item_id`
        SELECT quantity
        INTO initial_quantity
        FROM store_item
        WHERE store_item_id = (item ->> 'store_item_id')::INT
        FOR UPDATE;

        -- Check if sufficient quantity is available
        IF initial_quantity IS NULL OR initial_quantity < (item ->> 'issue_quantity')::NUMERIC THEN
            RAISE EXCEPTION 'Insufficient quantity for store_item_id: %', (item ->> 'store_item_id')::INT;
        END IF;

        -- Update the quantity in store_item
        UPDATE store_item
        SET quantity = quantity - (item ->> 'issue_quantity')::NUMERIC
        WHERE store_item_id = (item ->> 'store_item_id')::INT
        RETURNING quantity
        INTO final_quantity;

        -- Insert into store_issue_line
        INSERT INTO store_issue_line (
            store_issue_header_id,
            store_item_id,
            issue_quantity,
            initial_value,
            final_value
        )
        VALUES (
            header_id,
            (item ->> 'store_item_id')::INT,
            (item ->> 'issue_quantity')::NUMERIC,
            initial_quantity,
            final_quantity
        );

        -- instert into item_tracking
        INSERT INTO item_tracking(store_item_id, current_quantity, new_quantity, reason)
        VALUES ((item ->> 'store_item_id')::INT, initial_quantity, final_quantity, 'Issue');
    END LOOP;

    RETURN QUERY
    SELECT header_id, issue_date_out, description_out, issued_by_out, created_by_out;
END;
$$ LANGUAGE plpgsql;








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



----------------------------------------- sale order processing

CREATE OR REPLACE FUNCTION sales_order_processing(
    menu_items JSON,      -- First JSON array for menu items
    store_items JSON      -- Second JSON array for store items
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_menu_item_id INT;
    pl_menu_qty NUMERIC(15, 2);
    current_quantity NUMERIC(15, 2);
    new_quantity NUMERIC(15, 2);

    pl_store_item_id INT;  -- Variable for store item ID
    pl_source_type VARCHAR(200); -- Variable for source type (MAIN_STORE or HOT_KITCHEN)
    pl_store_qty NUMERIC(15, 2); -- Store quantity to subtract
    store_current_quantity NUMERIC(15, 2);  -- Current quantity in store
    store_new_quantity NUMERIC(15, 2);      -- New quantity after update
BEGIN
    -- Process menu items
    FOR item IN
        SELECT * FROM json_array_elements(menu_items)
    LOOP
        pl_menu_item_id := (item->>'menu_item_id')::INT;
        pl_menu_qty := (item->>'quantity')::NUMERIC;

        -- Lock the row and fetch the current quantity for menu_item
        SELECT quantity INTO current_quantity
        FROM menu_item
        WHERE menu_item_id = pl_menu_item_id
        FOR UPDATE;

        -- Update the menu item quantity
        UPDATE menu_item
        SET quantity = current_quantity + pl_menu_qty
        WHERE menu_item_id = pl_menu_item_id
        RETURNING quantity INTO new_quantity;

        -- Insert into menu tracking
        INSERT INTO menu_tracking (menu_item_id, current_quantity, new_quantity, reason)
        VALUES (pl_menu_item_id, current_quantity, new_quantity, 'Sales Order processing');
    END LOOP;

    -- Process store items
    FOR item IN
        SELECT * FROM json_array_elements(store_items)
    LOOP
        pl_store_item_id := (item->>'store_item_id')::INT;
        pl_source_type := (item->>'source_type')::VARCHAR;
        pl_store_qty := (item->>'quantity')::NUMERIC;

        IF pl_source_type = 'RESTAURANT' THEN
            -- Lock and fetch current quantity for MAIN_STORE items
            SELECT quantity INTO store_current_quantity
            FROM restaurant_store
            WHERE store_item_id = pl_store_item_id
            FOR UPDATE;

            -- Update MAIN_STORE item quantity
            UPDATE restaurant_store
            SET quantity = store_current_quantity - pl_store_qty
            WHERE store_item_id = pl_store_item_id
            RETURNING quantity INTO store_new_quantity;

            -- Insert into item tracking
            INSERT INTO restaurant_tracking (store_item_id, current_quantity, new_quantity, reason)
            VALUES (pl_store_item_id, store_current_quantity, store_new_quantity, 'Sales order processing');

            -- Raise exception if quantity goes negative
            IF store_current_quantity - pl_store_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for store_item_id % in restaunt would be negative', pl_store_item_id;
            END IF;
        END IF;

        IF pl_source_type = 'KITCHEN' THEN
            -- Lock and fetch current quantity for HOT_KITCHEN items
            SELECT quantity INTO store_current_quantity
            FROM kitchen_store
            WHERE store_item_id = pl_store_item_id
            FOR UPDATE;

            -- Update HOT_KITCHEN item quantity
            UPDATE kitchen_store
            SET quantity = store_current_quantity - pl_store_qty
            WHERE store_item_id = pl_store_item_id
            RETURNING quantity INTO store_new_quantity;

            -- Insert into hot kitchen tracking
            INSERT INTO hot_kitchen_tracking (store_item_id, current_quantity, new_quantity, reason)
            VALUES (pl_store_item_id, store_current_quantity, store_new_quantity, 'Sales order processing');

            -- Raise exception if quantity goes negative
            IF store_current_quantity - pl_store_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for store_item_id % in kitch would be negative', pl_store_item_id;
            END IF;
        END IF;
    END LOOP;

END;
$$ LANGUAGE plpgsql;




-----------------KITCHEN SETUP REGISTER

CREATE OR REPLACE FUNCTION process_kitchen_setup(
    station_id INT,
    menu_item_id INT,
    managed VARCHAR(255),
    ingredients_value JSONB
) RETURNS VOID AS $$
DECLARE
    menu_name TEXT;
    kitchen_setup_id INT;
    ingredient JSONB;
    store_item_exists BOOLEAN;
BEGIN
    -- Validate station_id
    IF station_id IS NULL THEN
        RAISE EXCEPTION 'Station ID is required';
    END IF;

    -- Validate menu_item_id
    IF menu_item_id IS NULL THEN
        RAISE EXCEPTION 'Menu item ID is required';
    END IF;

    -- Validate ingredients_value
    IF jsonb_array_length(ingredients_value) = 0 THEN
        RAISE EXCEPTION 'Ingredient value is required';
    END IF;

    -- Get menu name from menu_register
    SELECT mr.name INTO menu_name
    FROM menu_register AS mr
    INNER JOIN menu_item AS mi ON mr.menu_register_id = mi.menu_register_id
    WHERE mi.menu_item_id = process_kitchen_setup.menu_item_id; -- Explicitly reference the variable

    IF menu_name IS NULL THEN
        RAISE EXCEPTION 'Menu name not found for menu_item_id %', menu_item_id;
    END IF;

    -- Insert into kitchen_setup
    INSERT INTO kitchen_setup (station_id, menu_item_id, name, managed)
    VALUES (station_id, menu_item_id, menu_name, managed)
    RETURNING kitchen_setup.kitchen_setup_id INTO kitchen_setup_id; -- Explicitly reference the column with table name

    -- Iterate through the ingredients_value JSON array
    FOR ingredient IN SELECT * FROM jsonb_array_elements(ingredients_value)
    LOOP
        -- Validate if source_type exists
        IF ingredient->>'source_type' = 'HOT_KITCHEN' THEN
            -- Check if store_item_id exists in kitchen_store
            SELECT EXISTS(
                SELECT 1 FROM kitchen_store WHERE store_item_id = (ingredient->>'store_item_id')::INT
            ) INTO store_item_exists;

            IF NOT store_item_exists THEN
                RAISE EXCEPTION 'store_item_id % does not exist in kitchen_store', ingredient->>'store_item_id';
            END IF;
        ELSIF ingredient->>'source_type' = 'RESTAURANT' THEN
            -- Check if store_item_id exists in restaurant_store
            SELECT EXISTS(
                SELECT 1 FROM restaurant_store WHERE store_item_id = (ingredient->>'store_item_id')::INT
            ) INTO store_item_exists;

            IF NOT store_item_exists THEN
                RAISE EXCEPTION 'store_item_id % does not exist in restaurant_store', ingredient->>'store_item_id';
            END IF;
        ELSE
            RAISE EXCEPTION 'Invalid source_type % for ingredient', ingredient->>'source_type';
        END IF;

        -- Insert into kitchen_ingredients
        INSERT INTO kitchen_ingredients (ingredients_id, store_item_id, quantity, source_type)
        VALUES (
            kitchen_setup_id, -- Explicitly references the variable
            (ingredient->>'store_item_id')::INT,
            (ingredient->>'quantity')::NUMERIC,
            ingredient->>'source_type'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

