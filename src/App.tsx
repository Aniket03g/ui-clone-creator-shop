import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import SearchResults from "./pages/SearchResults";
import Profile from "./pages/Profile";
import About from "./pages/About";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnsPolicy from "./pages/ReturnsPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import Electronics from "./pages/Electronics";
import ProductForm from "./pages/ProductForm";
import Auth from "./pages/Auth";
import UpdatePassword from "./pages/UpdatePassword";
import Category from "./pages/Category";
import MainLayout from "@/components/MainLayout";
import ManageCategories from "./pages/ManageCategories";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <WishlistProvider>
                <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public auth-related routes without layout if desired */}
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/update-password" element={<UpdatePassword />} />

                  {/* Main site layout with header/footer */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Index />} />
                    <Route path="/store" element={<Products />} />

                    {/* Category routes - all point to the same Category component */}
                    <Route path="/laptops" element={<Category />} />
                    <Route path="/routers" element={<Category />} />
                    <Route path="/pcs" element={<Category />} />
                    <Route path="/ups" element={<Category />} />
                    <Route path="/components" element={<Category />} />
                    <Route path="/electronics" element={<Category />} />
                    <Route path="/monitors" element={<Category />} />
                    <Route path="/keyboards" element={<Category />} />
                    <Route path="/mice" element={<Category />} />
                    <Route path="/headphones" element={<Category />} />
                    {/* Keep the category/:slug route for backward compatibility */}
                    <Route path="/category/:slug" element={<Category />} />

                    {/* Product details under main layout */}
                    <Route path="/product/:id" element={<ProductDetail />} />

                    {/* Misc pages */}
                    <Route path="/about" element={<About />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/returns-policy" element={<ReturnsPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/terms" element={<TermsOfService />} />
                  </Route>

                  {/* Admin routes */}
                  <Route path="/admin/add-product" element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  } />
                  <Route path="/admin/edit-product/:id" element={
                    <AdminRoute>
                      <ProductForm />
                    </AdminRoute>
                  } />
                  <Route path="/admin/manage-categories" element={
                    <AdminRoute>
                      <ManageCategories />
                    </AdminRoute>
                  } />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
                </TooltipProvider>
              </WishlistProvider>
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </UserProvider>
    </QueryClientProvider>
);

export default App;
