import React from 'react';
import { FiCheck, FiPackage, FiTruck, FiHome, FiClock, FiXCircle } from 'react-icons/fi';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheck },
  { key: 'packed', label: 'Packed', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiHome },
];

export default function OrderStepper({ status = 'pending',updatedAt }) {
  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  const activeIdx = currentStepIndex >= 0 ? currentStepIndex : 1;

  if (status?.toLowerCase() === "cancelled") {
  return (
    <div className="py-6 px-4 bg-gray-900/50 border border-red-800 rounded-2xl">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
          <FiXCircle className="text-white text-xl" />
        </div>

        <div>
          <p className="text-sm font-bold text-red-400">
            Order Cancelled
          </p>
           <p className="text-xs text-gray-400">
              This order has been cancelled successfully.
            </p>
            <p className="text-xs text-gray-500 mt-1">
                Cancelled on{" "}
                {updatedAt
                ? new Date(updatedAt).toLocaleString("en-IN") 
                : "N/A"}
            </p>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="py-6 px-4 bg-gray-900/50 border border-gray-800 rounded-2xl">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-lg ${
                  isCompleted
                    ? 'bg-indigo-600 text-white shadow-indigo-500/40 ring-4 ring-indigo-500/20'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                } ${isCurrent ? 'animate-bounce' : ''}`}
              >
                <Icon />
              </div>
              <span
                className={`mt-2 text-xs font-semibold hidden sm:block ${
                  isCompleted ? 'text-indigo-400' : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
