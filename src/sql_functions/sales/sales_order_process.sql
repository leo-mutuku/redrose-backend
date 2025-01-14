CREATE OR REPLACE FUNCTION sales_order_process(
    menu_items JSON,      -- First JSON array for menu items
    store_items JSON      -- Second JSON array for store items
)
RETURNS text AS $$
DECLARE
    item JSON;
    pl_menu_item_id INT;
    pl_menu_qty NUMERIC(15, 2);
    current_quantity NUMERIC(15, 2);
    new_quantity NUMERIC(15, 2);

    pl_store_item_id INT;  -- Variable for store item ID
    pl_source_type VARCHAR(200); -- Variable for source type (RESTAURANT or KITCHEN)
    pl_store_qty NUMERIC(15, 2); -- Store quantity to subtract
    store_current_quantity NUMERIC(15, 2);  -- Current quantity in store
    store_new_quantity NUMERIC(15, 2);      -- New quantity after update

    v_error_message text;  -- Variable to capture error messages
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
                RAISE EXCEPTION 'Quantity for store_item_id % in restaurant would be negative', pl_store_item_id;
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
                RAISE EXCEPTION 'Quantity for store_item_id % in kitchen would be negative', pl_store_item_id;
            END IF;
        END IF;
    END LOOP;

    RETURN 'Success';
EXCEPTION WHEN OTHERS THEN
    -- Handle exceptions and return the error message
    v_error_message := SQLERRM;
    RETURN 'Error: ' || v_error_message;
END;
$$ LANGUAGE plpgsql;





-- test on sql shell  


DO $$ DECLARE v_status text; 
BEGIN v_status := sales_order_process( '[ 
{"menu_item_id": 70, "quantity": 800}, {"menu_item_id":107, "quantity":1} ]'::json, '[ {"store_item_id": 45, "source_type": "KITCHEN", "quantity": 4}, {"store_item_id":41, "source_type":"RESTAURANT", "quantity":2} ]'::json ); 
RAISE NOTICE 'Status: %', v_status; END $$;
