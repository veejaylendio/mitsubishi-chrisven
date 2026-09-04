export type LoanQuote = {
  monthlyPayment: number;
  totalInterest: number;
  totalPayable: number;
};

/** Flat add-on rate: PH banks quote a fixed annual rate applied to the original principal, not a diminishing balance. */
export function computeLoanQuote(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): LoanQuote {
  const totalInterest = principal * (annualRatePercent / 100) * (termMonths / 12);
  const totalPayable = principal + totalInterest;
  const monthlyPayment = totalPayable / termMonths;
  return { monthlyPayment, totalInterest, totalPayable };
}
