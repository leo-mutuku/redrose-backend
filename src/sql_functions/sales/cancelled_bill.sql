CREATE OR REPLACE FUNCTION cancelled_bill_process(
    order JSON,      -- First JSON array for menu items
)
RETURNS TEXT AS $$
DECLARE
    order_id INT;
    