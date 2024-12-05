

-- Food processing  - procedure to get kitchen setup and linkage between store_item and menu-item

CREATE OR REPLACE FUNCTION get_kitchen_ingredients_by_setup_id(
    food_items JSON
)
RETURNS TABLE(
    ingredients_id INT,
    store_item_id INT,
    quantity NUMERIC(15,2)  -- Updated return type for quantity
) AS $$
DECLARE
    item JSON;
    kitchen_setup_id INT;
    qty NUMERIC(15,2);
    ingredients_found INT;
BEGIN
    -- Loop through the JSON array to process each item
    FOR item IN 
        SELECT * FROM json_array_elements(food_items)  -- Get each JSON element
    LOOP
        -- Extract the kitchen_setup_id and quantity from the JSON object
        kitchen_setup_id := (item->>'kitchen_setup_id')::INT;
        qty := (item->>'quantity')::NUMERIC;

        -- Check if there are any ingredients matching the kitchen_setup_id
        SELECT COUNT(*)
        INTO ingredients_found
        FROM kitchen_ingredients ki
        WHERE ki.ingredients_id = kitchen_setup_id;

        -- If no ingredients found, raise an exception
        IF ingredients_found = 0 THEN
            RAISE EXCEPTION 'No ingredients found for kitchen_setup_id: %', kitchen_setup_id;
        END IF;

        -- Select the ingredients, multiplying quantity by the passed qty
        RETURN QUERY
        SELECT
            ki.ingredients_id,
            ki.store_item_id,
            ki.quantity * qty AS quantity  -- Multiply the quantity from the table by the qty
        FROM
            kitchen_ingredients ki
        WHERE
            ki.ingredients_id = kitchen_setup_id;
    END LOOP;
    
    -- If no results, return empty
    RETURN;
END;
$$ LANGUAGE plpgsql;




-- Food processing  - procedure to update store_item and item_tracking

CREATE OR REPLACE FUNCTION update_store_item_quantities(
    food_items JSON
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_store_item_id INT;  -- PL/pgSQL variable to store the store_item_id
    pl_qty NUMERIC(15,2);  -- PL/pgSQL variable to store the quantity
    current_quantity NUMERIC(15,2);  -- Variable to store the current quantity from store_item
    new_quantity NUMERIC(15,2);  -- Variable to store the new quantity after update
BEGIN
    -- Loop through the JSON array to process each item
    FOR item IN 
        SELECT * FROM json_array_elements(food_items)  -- Get each JSON element
    LOOP
        -- Extract store_item_id and quantity from the JSON object
        pl_store_item_id := (item->>'store_item_id')::INT;  -- Assign to PL/pgSQL variable
        pl_qty := (item->>'quantity')::NUMERIC;  -- Assign to PL/pgSQL variable

        -- Lock the row for the store_item_id to prevent race conditions
        FOR current_quantity IN 
            SELECT si.quantity  -- Explicitly qualify the column name
            FROM store_item si  -- Explicitly qualify the table name
            WHERE si.store_item_id = pl_store_item_id  -- Use the PL/pgSQL variable
            FOR UPDATE  -- Row-level lock
        LOOP
            -- Check if the new quantity after update would be negative
            IF current_quantity - pl_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for store_item_id % would be negative', pl_store_item_id;
            ELSE
                -- Calculate the new quantity after subtraction
                new_quantity := current_quantity - pl_qty;

                -- Update the store_item quantity with the new value
                UPDATE store_item
                SET quantity = new_quantity
                WHERE store_item_id = pl_store_item_id;

                -- Insert into item_tracking table to track the change
                INSERT INTO item_tracking (store_item_id, current_quantity, new_quantity, reason)
                VALUES (pl_store_item_id, current_quantity, new_quantity, 'Food processing');
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


--Food processing  - Procedure to update menu_item and menu tracking

CREATE OR REPLACE FUNCTION update_menu_item_quantities(
    food_items JSON
)
RETURNS VOID AS $$
DECLARE
    item JSON;
    pl_store_menu_id INT;  -- PL/pgSQL variable to store the menu_item_id
    pl_qty NUMERIC(15,2);  -- PL/pgSQL variable to store the quantity
    current_quantity NUMERIC(15,2);  -- Variable to store the current quantity from menu_item
    new_quantity NUMERIC(15,2);  -- Variable to store the new quantity after update
BEGIN
    -- Loop through the JSON array to process each item
    FOR item IN 
        SELECT * FROM json_array_elements(food_items)  -- Get each JSON element
    LOOP
        -- Extract menu_item_id and quantity from the JSON object
        pl_store_menu_id := (item->>'menu_item_id')::INT;  -- Assign to PL/pgSQL variable
        pl_qty := (item->>'quantity')::NUMERIC;  -- Assign to PL/pgSQL variable

        -- Lock the row for the menu_item_id to prevent race conditions
        FOR current_quantity IN 
            SELECT mi.quantity  -- Explicitly qualify the column name
            FROM menu_item mi  -- Explicitly qualify the table name
            WHERE mi.store_item_id = pl_store_item_id  -- Use the PL/pgSQL variable
            FOR UPDATE  -- Row-level lock
        LOOP
            -- Check if the new quantity after update would be negative
            IF  pl_qty < 0 THEN
                RAISE EXCEPTION 'Quantity for menu_item_id % negative update not allowed', pl_menu_item_id;
            ELSE
                -- Calculate the new quantity after adsition
                new_quantity := current_quantity + pl_qty;

                -- Update the menu_item quantity with the new value
                UPDATE menu_item
                SET quantity = new_quantity
                WHERE menu_item_id = pl_menu_item_id;

                -- Insert into menu_tracking table to track the change
                INSERT INTO menu_tracking (store_item_id, current_quantity, new_quantity, reason)
                VALUES (pl_store_item_id, current_quantity, new_quantity, 'Food processing');
            END IF;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


--trigger to update store_item and menu_item quantities
SELECT update_menu_item_quantities('[{"menu_item_id": 9, "quantity": 100}]'::json);








-------------------------------------------End of food processing procedures ---------------------------


--------------------------------------------Start of purchase procedures--------------------------------




