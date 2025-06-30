
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  aadharNumber?: string;
  gstNumber?: string;
  addresses: Address[];
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  aadharNumber?: string;
  gstNumber?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('techshop_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('techshop_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      // Check if user exists in localStorage (for demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem('techshop_users') || '[]');
      const existingUser = existingUsers.find((u: any) => u.email === email);
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('techshop_user', JSON.stringify(existingUser));
        return true;
      } else {
        // Create a mock user for demo
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          phone: '9876543210',
          aadharNumber: '123456789012',
          addresses: []
        };
        setUser(mockUser);
        localStorage.setItem('techshop_user', JSON.stringify(mockUser));
        return true;
      }
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Validate that either Aadhar or GST is provided
    if (!userData.aadharNumber && !userData.gstNumber) {
      throw new Error('Either Aadhar Card Number or GST Number is required');
    }

    // Mock registration - in real app, this would call an API
    if (userData.email && userData.password && userData.firstName && userData.lastName && userData.phone) {
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        aadharNumber: userData.aadharNumber,
        gstNumber: userData.gstNumber,
        addresses: []
      };
      
      // Store user in users list (for demo purposes)
      const existingUsers = JSON.parse(localStorage.getItem('techshop_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('techshop_users', JSON.stringify(existingUsers));
      
      setUser(newUser);
      localStorage.setItem('techshop_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('techshop_user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('techshop_user', JSON.stringify(updatedUser));
      
      // Update in users list as well
      const existingUsers = JSON.parse(localStorage.getItem('techshop_users') || '[]');
      const updatedUsers = existingUsers.map((u: User) => 
        u.id === user.id ? updatedUser : u
      );
      localStorage.setItem('techshop_users', JSON.stringify(updatedUsers));
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString()
      };
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress]
      };
      setUser(updatedUser);
      localStorage.setItem('techshop_user', JSON.stringify(updatedUser));
    }
  };

  const updateAddress = (addressId: string, addressData: Partial<Address>) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr =>
        addr.id === addressId ? { ...addr, ...addressData } : addr
      );
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('techshop_user', JSON.stringify(updatedUser));
    }
  };

  const deleteAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('techshop_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      login,
      register,
      logout,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      isAuthenticated: !!user
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
