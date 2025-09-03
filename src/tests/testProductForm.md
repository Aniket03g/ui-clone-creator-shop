# Product Form Testing Guide

This guide provides steps to manually test the ProductForm component with different product types to ensure all fields render correctly and form submission works properly.

## Test Cases by Product Type

### 1. Laptop Product Type

**Test Data:**
```json
{
  "name": "Test Laptop",
  "description": "A high-performance laptop for testing",
  "price": 999.99,
  "sku": "LAP-TEST-001",
  "stock_quantity": 10,
  "status": "published",
  "product_type": "laptop",
  "main_category": "computers",
  "sub_categories": ["laptops", "gaming"],
  "brand": "TestBrand",
  "cpu": "Intel i7",
  "ram_gb": 16,
  "storage_gb": 512,
  "gpu": "NVIDIA RTX 3060",
  "display_size_inches": 15.6,
  "operating_system": "Windows 11"
}
```

**Testing Steps:**
1. Navigate to `/admin/products/new`
2. Select "Laptop" from the product type dropdown
3. Fill in all fields with the test data
4. Verify all laptop-specific fields appear (brand, CPU, RAM, storage, GPU, display size, OS)
5. Submit the form
6. Verify the product is created successfully
7. Navigate to the product detail page and confirm all data is displayed correctly

### 2. Headphones Product Type

**Test Data:**
```json
{
  "name": "Test Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 199.99,
  "sku": "HEAD-TEST-001",
  "stock_quantity": 25,
  "status": "published",
  "product_type": "headphones",
  "main_category": "audio",
  "sub_categories": ["headphones", "wireless"],
  "driver_type": "Dynamic",
  "connectivity": "Bluetooth 5.0",
  "noise_cancellation": true,
  "has_microphone": true
}
```

**Testing Steps:**
1. Navigate to `/admin/products/new`
2. Select "Headphones" from the product type dropdown
3. Fill in all fields with the test data
4. Verify all headphones-specific fields appear (driver type, connectivity, noise cancellation, microphone)
5. Verify the checkbox fields (noise cancellation, has microphone) work correctly
6. Submit the form
7. Verify the product is created successfully
8. Navigate to the product detail page and confirm all data is displayed correctly

### 3. Accessory Product Type

**Test Data:**
```json
{
  "name": "Test Accessory",
  "description": "Universal accessory for laptops",
  "price": 29.99,
  "sku": "ACC-TEST-001",
  "stock_quantity": 50,
  "status": "published",
  "product_type": "accessory",
  "main_category": "accessories",
  "sub_categories": ["laptop-accessories"],
  "compatibility": "All laptops",
  "material": "Aluminum"
}
```

**Testing Steps:**
1. Navigate to `/admin/products/new`
2. Select "Accessory" from the product type dropdown
3. Fill in all fields with the test data
4. Verify all accessory-specific fields appear (compatibility, material)
5. Submit the form
6. Verify the product is created successfully
7. Navigate to the product detail page and confirm all data is displayed correctly

## Additional Test Cases

### Edit Existing Product
1. Navigate to an existing product's edit page
2. Modify some fields
3. Submit the form
4. Verify the changes are saved correctly

### Form Validation
1. Try submitting the form without filling required fields
2. Verify appropriate validation errors are displayed
3. Try entering invalid data (e.g., negative price)
4. Verify validation prevents submission and shows error messages

### Image Upload
1. Add images to a product
2. Verify images are uploaded and displayed correctly
3. Try removing images
4. Verify images are removed correctly

## Expected Results
- All form fields should render correctly based on the selected product type
- Required field validation should work properly
- Form submission should succeed with valid data
- Product data should be saved correctly in the database
- Specifications should be stored as JSON and displayed correctly
