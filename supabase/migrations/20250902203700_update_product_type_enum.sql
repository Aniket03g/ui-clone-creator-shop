-- Update the product_type_enum to include all values used in the application
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'router';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'ups';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'monitor';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'keyboard';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'mouse';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'headphones';
ALTER TYPE product_type_enum ADD VALUE IF NOT EXISTS 'desktop-pc';
