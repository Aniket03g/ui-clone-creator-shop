
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, User, LogOut, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useUser } from '@/contexts/UserContext';
import SearchDropdown from './SearchDropdown';
import AuthDialog from './AuthDialog';
import AmazonHeader from './AmazonHeader';

const Header = () => {
  // Return the new Amazon-style header
  return <AmazonHeader />;
};

export default Header;
