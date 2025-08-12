-- Add missing product types to the enum
ALTER TYPE product_type_enum ADD VALUE 'router';
ALTER TYPE product_type_enum ADD VALUE 'ups';
ALTER TYPE product_type_enum ADD VALUE 'monitor';
ALTER TYPE product_type_enum ADD VALUE 'keyboard';
ALTER TYPE product_type_enum ADD VALUE 'mouse';
ALTER TYPE product_type_enum ADD VALUE 'headphones';