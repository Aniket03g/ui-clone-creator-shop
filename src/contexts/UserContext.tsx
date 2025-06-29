
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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call an API
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        addresses: []
      };
      setUser(mockUser);
      localStorage.setItem('techshop_user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    if (userData.email && userData.password) {
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
