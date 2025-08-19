-- Create categories table with hierarchical structure
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can create categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert initial categories based on the hardcoded structure in AmazonHeader.tsx
INSERT INTO public.categories (name, slug) VALUES
('Laptops & Computers', 'laptops-and-computers'),
('Computer Components', 'computer-components'),
('Networking & Internet', 'networking-and-internet'),
('Power & UPS', 'power-and-ups'),
('Software & Licenses', 'software-and-licenses'),
('Accessories & Peripherals', 'accessories-and-peripherals');

-- Insert subcategories for Laptops & Computers
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'laptops-and-computers')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Gaming Laptops', 'gaming-laptops', (SELECT id FROM parent)),
('Business Laptops', 'business-laptops', (SELECT id FROM parent)),
('Desktop PCs', 'desktop-pcs', (SELECT id FROM parent)),
('All-in-One PCs', 'all-in-one-pcs', (SELECT id FROM parent)),
('2-in-1 Laptops', '2-in-1-laptops', (SELECT id FROM parent)),
('Workstations', 'workstations', (SELECT id FROM parent)),
('Mini PCs', 'mini-pcs', (SELECT id FROM parent)),
('Refurbished Systems', 'refurbished-systems', (SELECT id FROM parent));

-- Insert subcategories for Computer Components
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'computer-components')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Processors (CPUs)', 'processors-cpus', (SELECT id FROM parent)),
('Graphics Cards (GPUs)', 'graphics-cards-gpus', (SELECT id FROM parent)),
('Memory (RAM)', 'memory-ram', (SELECT id FROM parent)),
('Storage (SSD/HDD)', 'storage-ssd-hdd', (SELECT id FROM parent)),
('Motherboards', 'motherboards', (SELECT id FROM parent)),
('Power Supplies', 'power-supplies', (SELECT id FROM parent)),
('Cooling Systems', 'cooling-systems', (SELECT id FROM parent)),
('Computer Cases', 'computer-cases', (SELECT id FROM parent));

-- Insert subcategories for Networking & Internet
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'networking-and-internet')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Wi-Fi Routers', 'wi-fi-routers', (SELECT id FROM parent)),
('Modems', 'modems', (SELECT id FROM parent)),
('Network Switches', 'network-switches', (SELECT id FROM parent)),
('Access Points', 'access-points', (SELECT id FROM parent)),
('Network Cables', 'network-cables', (SELECT id FROM parent)),
('Firewalls', 'firewalls', (SELECT id FROM parent)),
('VPN Hardware', 'vpn-hardware', (SELECT id FROM parent)),
('Mesh Systems', 'mesh-systems', (SELECT id FROM parent));

-- Insert subcategories for Power & UPS
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'power-and-ups')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('UPS Systems', 'ups-systems', (SELECT id FROM parent)),
('Power Strips', 'power-strips', (SELECT id FROM parent)),
('Surge Protectors', 'surge-protectors', (SELECT id FROM parent)),
('Battery Backups', 'battery-backups', (SELECT id FROM parent)),
('Voltage Stabilizers', 'voltage-stabilizers', (SELECT id FROM parent)),
('Power Inverters', 'power-inverters', (SELECT id FROM parent)),
('Solar Power Systems', 'solar-power-systems', (SELECT id FROM parent)),
('Power Cables', 'power-cables', (SELECT id FROM parent));

-- Insert subcategories for Software & Licenses
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'software-and-licenses')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Microsoft Office 365', 'microsoft-office-365', (SELECT id FROM parent)),
('Windows Operating System', 'windows-operating-system', (SELECT id FROM parent)),
('Antivirus Software', 'antivirus-software', (SELECT id FROM parent)),
('Business Software', 'business-software', (SELECT id FROM parent)),
('Design Software', 'design-software', (SELECT id FROM parent)),
('Development Tools', 'development-tools', (SELECT id FROM parent)),
('Productivity Apps', 'productivity-apps', (SELECT id FROM parent)),
('Security Software', 'security-software', (SELECT id FROM parent));

-- Insert subcategories for Accessories & Peripherals
WITH parent AS (SELECT id FROM public.categories WHERE slug = 'accessories-and-peripherals')
INSERT INTO public.categories (name, slug, parent_id) VALUES
('Keyboards & Mice', 'keyboards-and-mice', (SELECT id FROM parent)),
('Monitors & Displays', 'monitors-and-displays', (SELECT id FROM parent)),
('Webcams', 'webcams', (SELECT id FROM parent)),
('Speakers & Headsets', 'speakers-and-headsets', (SELECT id FROM parent)),
('External Storage', 'external-storage', (SELECT id FROM parent)),
('Cables & Adapters', 'cables-and-adapters', (SELECT id FROM parent)),
('Docking Stations', 'docking-stations', (SELECT id FROM parent)),
('Printer & Scanners', 'printer-and-scanners', (SELECT id FROM parent));
