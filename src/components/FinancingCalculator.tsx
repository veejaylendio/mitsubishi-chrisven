"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { computeLoanQuote } from "@/lib/financing/calculate";
import type { BankRate, VehiclePriceOption } from "@/lib/types";

const TERM_OPTIONS = [12, 24, 36, 48, 60];

function vehicleLabel(vehicle: VehiclePriceOption) {
  return [vehicle.year, vehicle.name, vehicle.trim].filter(Boolean).join(" ");
}

function peso(amount: number) {
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

export default function FinancingCalculator({
  banks,
  vehicles,
}: {
  banks: BankRate[];
  vehicles: VehiclePriceOption[];
}) {
  const [vehicleId, setVehicleId] = useState("");
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [term, setTerm] = useState(TERM_OPTIONS[2]);

  function handleVehicleChange(id: string) {
    setVehicleId(id);
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle?.price != null) {
      setPrice(String(vehicle.price));
    }
  }

  const principal = Math.max(0, (Number(price) || 0) - (Number(downPayment) || 0));

  const quotes = useMemo(() => {
    return banks
      .filter(
        (bank) =>
          (bank.min_term_months == null || term >= bank.min_term_months) &&
          (bank.max_term_months == null || term <= bank.max_term_months),
      )
      .map((bank) => ({
        bank,
        quote: computeLoanQuote(principal, bank.interest_rate, term),
      }))
      .sort((a, b) => a.quote.monthlyPayment - b.quote.monthlyPayment);
  }, [banks, principal, term]);

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vehicle (optional)">
          <select
            value={vehicleId}
            onChange={(e) => handleVehicleChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Enter price manually</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicleLabel(vehicle)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Loan term">
          <select
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className={inputClass}
          >
            {TERM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} months
              </option>
            ))}
          </select>
        </Field>
        <Field label="Vehicle price (₱)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Down payment (₱)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {principal > 0 ? (
        quotes.length ? (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Bank</th>
                  <th className="px-4 py-3">Rate/yr</th>
                  <th className="px-4 py-3">Monthly payment</th>
                  <th className="px-4 py-3">Total interest</th>
                  <th className="px-4 py-3">Total payable</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(({ bank, quote }, index) => (
                  <tr key={bank.id} className="border-t border-gray-100 align-top">
                    <td className="px-4 py-3 font-semibold text-brand-black">
                      {bank.bank_name}
                      {index === 0 && (
                        <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-red">
                          Lowest monthly
                        </span>
                      )}
                      {bank.notes && <p className="mt-1 text-xs font-normal text-gray-400">{bank.notes}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{bank.interest_rate}%</td>
                    <td className="px-4 py-3 font-semibold text-brand-black">
                      {peso(quote.monthlyPayment)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{peso(quote.totalInterest)}</td>
                    <td className="px-4 py-3 text-gray-600">{peso(quote.totalPayable)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No partner bank offers a {term}-month term right now. Try a different term.
          </p>
        )
      ) : (
        <p className="text-sm text-gray-500">Enter a vehicle price to see monthly payment estimates.</p>
      )}

      <p className="text-xs text-gray-400">
        Rates are indicative and subject to each bank&apos;s credit evaluation and current
        promos. Final approved rate and terms may differ.
      </p>

      <Link
        href="/apply"
        className="block w-full rounded-md bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-red-dark"
      >
        Apply for Financing
      </Link>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs font-semibold text-gray-500">
      {label}
      {children}
    </label>
  );
}
