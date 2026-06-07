-- Change item_rating from varchar(45) to DECIMAL(2,1)
-- Existing string values like '4.3', '5.0' convert cleanly to DECIMAL
ALTER TABLE menu MODIFY COLUMN item_rating DECIMAL(2,1) NOT NULL;
