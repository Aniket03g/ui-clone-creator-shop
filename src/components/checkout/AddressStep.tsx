
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/contexts/UserContext';
import { MapPin, Plus } from 'lucide-react';

interface AddressStepProps {
  onNext: (address: any) => void;
  onBack: () => void;
}

const AddressStep: React.FC<AddressStepProps> = ({ onNext, onBack }) => {
  const { user, isAuthenticated } = useUser();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [useNewAddress, setUseNewAddress] = useState(!isAuthenticated || !user?.addresses?.length);

  const handleNext = () => {
    if (!useNewAddress && !selectedAddress) return;
    if (useNewAddress && (!newAddress.fullName || !newAddress.street || !newAddress.city)) return;
    
    if (useNewAddress) {
      onNext(newAddress);
    } else {
      const selectedAddr = user?.addresses.find(addr => addr.id === selectedAddress);
      if (selectedAddr) {
        onNext({
          fullName: `${user.firstName} ${user.lastName}`,
          street: selectedAddr.street,
          city: selectedAddr.city,
          state: selectedAddr.state,
          zipCode: selectedAddr.zipCode,
          phone: user.phone
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAuthenticated && user?.addresses?.length > 0 && (
          <div>
            <h3 className="font-medium text-stone-900 mb-4">Saved Addresses</h3>
            <RadioGroup value={useNewAddress ? 'new' : selectedAddress} onValueChange={(value) => {
              if (value === 'new') {
                setUseNewAddress(true);
                setSelectedAddress('');
              } else {
                setUseNewAddress(false);
                setSelectedAddress(value);
              }
            }}>
              {user.addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3 p-4 border border-stone-200 rounded-lg">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-stone-100 text-stone-700 px-2 py-1 rounded text-sm capitalize">
                        {address.type}
                      </span>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-stone-900">{address.street}</p>
                    <p className="text-stone-600">{address.city}, {address.state} {address.zipCode}</p>
                  </Label>
                </div>
              ))}
              <div className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Add New Address
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {useNewAddress && (
          <div className="space-y-4">
            <h3 className="font-medium text-stone-900">
              {isAuthenticated && user?.addresses?.length > 0 ? 'New Address' : 'Shipping Address'}
            </h3>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={newAddress.street}
                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                placeholder="Enter your address"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter your city"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">PIN Code</Label>
                <Input
                  id="zipCode"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="Enter PIN code"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select value={newAddress.state} onValueChange={(value) => setNewAddress(prev => ({ ...prev, state: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newAddress.phone}
                onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-stone-200">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Cart
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={!useNewAddress && !selectedAddress}
          >
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressStep;
