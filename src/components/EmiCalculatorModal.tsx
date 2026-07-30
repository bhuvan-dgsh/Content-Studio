import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, X, Check, ShieldCheck, Percent, Calendar, DollarSign } from 'lucide-react';

interface EmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentPrice: number;
  equipmentTitle: string;
}

export const EmiCalculatorModal: React.FC<EmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  equipmentPrice,
  equipmentTitle,
}) => {
  const [downPayment, setDownPayment] = useState<number>(Math.round(equipmentPrice * 0.2));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [subsidyApplied, setSubsidyApplied] = useState<boolean>(true);

  if (!isOpen) return null;

  const loanAmount = Math.max(0, equipmentPrice - downPayment);
  const monthlyInterestRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEmi = 0;
  if (monthlyInterestRate > 0 && totalMonths > 0 && loanAmount > 0) {
    monthlyEmi = Math.round(
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
    );
  }

  const totalPayable = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalPayable - loanAmount);
  // NABARD / Govt Agri Equipment subsidy approx 25% on eligible items
  const estimatedGovtSubsidy = subsidyApplied ? Math.round(equipmentPrice * 0.25) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Agricultural Equipment EMI Calculator
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                  {equipmentTitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-5 text-sm">
            {/* Price & Summary */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Total Equipment Price
                </span>
                <p className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">
                  ₹{equipmentPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Calculated Monthly EMI
                </span>
                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{monthlyEmi.toLocaleString('en-IN')} <span className="text-xs font-normal">/mo</span>
                </p>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              {/* Down Payment */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Down Payment Amount
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{downPayment.toLocaleString('en-IN')} ({Math.round((downPayment / equipmentPrice) * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.round(equipmentPrice * 0.8)}
                  step={5000}
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Annual Interest Rate (Kisan Credit / Agri Loan)
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {interestRate}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min={4.0}
                  max={14.0}
                  step={0.25}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Loan Tenure */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Repayment Tenure
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {tenureYears} Years ({tenureYears * 12} Months)
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setTenureYears(yr)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        tenureYears === yr
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                      }`}
                    >
                      {yr} Yr{yr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Subsidy toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                    NABARD / Sub-Mission on Agri Mechanization Subsidy
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Est. Govt subsidy up to ₹{estimatedGovtSubsidy.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={subsidyApplied}
                onChange={(e) => setSubsidyApplied(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>

            {/* Summary Breakdown */}
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Principal Loan Amount:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Total Interest Payable:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  ₹{totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-800 dark:text-zinc-200 font-bold border-t border-zinc-200 dark:border-zinc-700 pt-1.5">
                <span>Total Outflow over {tenureYears} years:</span>
                <span className="text-emerald-700 dark:text-emerald-400">
                  ₹{(totalPayable + downPayment).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`EMI Quote of ₹${monthlyEmi}/month requested! The dealer will contact you with bank financing tie-ups.`);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-md shadow-emerald-600/20"
              >
                Apply for Loan Quote
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
