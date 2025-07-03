
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import PhoneVerification from './PhoneVerification';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const { login, register } = useUser();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    aadharNumber: '',
    gstNumber: ''
  });

  const [validationError, setValidationError] = useState('');

  const validateSignupForm = () => {
    if (!isLogin) {
      // Check if either Aadhar or GST is provided
      if (!formData.aadharNumber && !formData.gstNumber) {
        setValidationError('Either Aadhar Card Number or GST Number is required');
        return false;
      }
      
      // Validate Aadhar format if provided
      if (formData.aadharNumber && formData.aadharNumber.length !== 12) {
        setValidationError('Aadhar Card Number must be exactly 12 digits');
        return false;
      }
      
      // Basic validation for required fields
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setValidationError('All fields are required');
        return false;
      }

      // Validate phone number format
      if (!/^\d{10}$/.test(formData.phone)) {
        setValidationError('Phone number must be exactly 10 digits');
        return false;
      }
    }
    
    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignupForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          onOpenChange(false);
          resetForm();
        } else {
          toast({
            title: "Error",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // For signup, show phone verification step
        setShowPhoneVerification(true);
        toast({
          title: "Verification Required",
          description: `We've sent an OTP to ${formData.phone}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (isVerified: boolean) => {
    if (isVerified) {
      setIsLoading(true);
      try {
        const success = await register(formData);
        if (success) {
          toast({
            title: "Account created!",
            description: "Your account has been created and you're now signed in.",
          });
          onOpenChange(false);
          resetForm();
          setShowPhoneVerification(false);
        } else {
          toast({
            title: "Error",
            description: "Failed to create account.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOTP = () => {
    // Mock resend OTP - in real app, this would call an API
    console.log('Resending OTP to:', formData.phone);
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', aadharNumber: '', gstNumber: '' });
    setValidationError('');
    setShowPhoneVerification(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleBackToForm = () => {
    setShowPhoneVerification(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {showPhoneVerification ? 'Phone Verification' : (isLogin ? 'Sign In' : 'Create Account')}
          </DialogTitle>
        </DialogHeader>
        
        {showPhoneVerification ? (
          <div className="space-y-4">
            <PhoneVerification
              phoneNumber={formData.phone}
              onVerificationComplete={handlePhoneVerification}
              onResendOTP={handleResendOTP}
            />
            <Button
              variant="outline"
              onClick={handleBackToForm}
              className="w-full"
            >
              Back to Form
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required={!isLogin}
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
                    <p className="text-sm font-medium text-stone-700">
                      Identity Verification (Choose One) *
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Card Number</Label>
                      <Input
                        id="aadharNumber"
                        name="aadharNumber"
                        type="text"
                        placeholder="Enter 12-digit Aadhar number"
                        value={formData.aadharNumber}
                        onChange={handleInputChange}
                        maxLength={12}
                      />
                    </div>

                    <div className="text-center text-stone-500 text-sm">OR</div>

                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        name="gstNumber"
                        type="text"
                        placeholder="Enter GST number"
                        value={formData.gstNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {validationError && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
                  {validationError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : (isLogin ? 'Sign In' : 'Continue to Verification')}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={toggleAuthMode}
                className="text-sm"
              >
                {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
