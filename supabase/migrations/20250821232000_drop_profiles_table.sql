-- Drop all policies related to the profiles table first
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Drop any foreign key constraints that might reference the profiles table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT constraint_name, table_name 
              FROM information_schema.table_constraints 
              WHERE constraint_type = 'FOREIGN KEY' 
              AND constraint_schema = 'public'
              AND referenced_table_name = 'profiles') 
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.table_name) || ' DROP CONSTRAINT ' || quote_ident(r.constraint_name);
    END LOOP;
END $$;

-- Drop the profiles table completely
DROP TABLE IF EXISTS public.profiles CASCADE;
