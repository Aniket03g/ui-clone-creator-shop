
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerificationComplete: (isVerified: boolean) => void;
  onResendOTP: () => void;
}

const PhoneVerification = ({ phoneNumber, onVerificationComplete, onResendOTP }: PhoneVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Mock verification - in real app, this would call an API
    setTimeout(() => {
      // For demo purposes, accept any 6-digit OTP
      if (otp === '123456' || otp.length === 6) {
        toast({
          title: "Phone Verified!",
          description: "Your phone number has been successfully verified.",
        });
        onVerificationComplete(true);
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your OTP and try again.",
          variant: "destructive",
        });
        onVerificationComplete(false);
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendOTP = () => {
    setCountdown(30);
    setCanResend(false);
    setOtp('');
    onResendOTP();
    toast({
      title: "OTP Sent",
      description: `A new OTP has been sent to ${phoneNumber}`,
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Verify Your Phone Number</h3>
        <p className="text-sm text-stone-600 mb-4">
          We've sent a 6-digit verification code to
        </p>
        <p className="font-semibold text-stone-800">{phoneNumber}</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button 
          onClick={handleVerifyOTP} 
          disabled={otp.length !== 6 || isVerifying}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <div className="text-sm text-stone-600">
          {!canResend ? (
            <p>Resend OTP in {countdown} seconds</p>
          ) : (
            <Button
              variant="link"
              onClick={handleResendOTP}
              className="text-sm p-0 h-auto"
            >
              Resend OTP
            </Button>
          )}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-700">
            For demo purposes, you can use <strong>123456</strong> as the OTP
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;
