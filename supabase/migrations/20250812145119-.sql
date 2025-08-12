-- Step 1: Drop the existing products table and its dependencies
DROP TABLE IF EXISTS public.products CASCADE;

-- Step 2: Create the custom product type enum
CREATE TYPE product_type_enum AS ENUM ('laptop', 'software', 'accessory', 'component', 'peripheral');

-- Step 3: Create the new products table with common fields
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    sku TEXT UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    product_type product_type_enum,
    images TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}'
);

-- Step 4: Create GIN index for fast JSONB searching
CREATE INDEX idx_products_specifications_gin ON public.products USING GIN (specifications);

-- Step 5: Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 6: Recreate RLS policies for the new table structure
CREATE POLICY "Anyone can view published products" 
ON public.products 
FOR SELECT 
USING ((status = 'published') OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can create products" 
ON public.products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update products" 
ON public.products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete products" 
ON public.products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 7: Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at column and trigger
ALTER TABLE public.products ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();