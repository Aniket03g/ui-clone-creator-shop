
import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepsProps {
  currentStep: number;
  completedSteps: number[];
}

const steps = [
  { id: 1, name: 'Review Order', description: 'Check your items' },
  { id: 2, name: 'Address', description: 'Shipping information' },
  { id: 3, name: 'Payment', description: 'Payment method' },
  { id: 4, name: 'Delivery', description: 'Delivery options' },
  { id: 5, name: 'Summary', description: 'Final review' }
];

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep, completedSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                  completedSteps.includes(step.id)
                    ? 'bg-green-600 border-green-600 text-white'
                    : currentStep === step.id
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-white border-stone-300 text-stone-500'
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  currentStep === step.id ? 'text-red-600' : 'text-stone-600'
                }`}>
                  {step.name}
                </div>
                <div className="text-xs text-stone-500">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                completedSteps.includes(step.id) ? 'bg-green-600' : 'bg-stone-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
