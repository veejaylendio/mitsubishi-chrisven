"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { BankRate } from "@/lib/types";
import { createBankRate, deleteBankRate, toggleBankRateActive, updateBankRate } from "./actions";

type EditableField = "bank_name" | "notes";
type NumericField = "interest_rate" | "min_term_months" | "max_term_months";

export default function BankRatesManager({ initialRates }: { initialRates: BankRate[] }) {
  const [rates, setRates] = useState(initialRates);
  const [pending, startTransition] = useTransition();

  const [newBankName, setNewBankName] = useState("");
  const [newRate, setNewRate] = useState("");
  const [newMinTerm, setNewMinTerm] = useState("12");
  const [newMaxTerm, setNewMaxTerm] = useState("60");
  const [newNotes, setNewNotes] = useState("");

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newBankName.trim() || !newRate) return;
    const bank_name = newBankName.trim();
    const interest_rate = Number(newRate);
    const min_term_months = Number(newMinTerm);
    const max_term_months = Number(newMaxTerm);
    const notes = newNotes.trim() || null;
    startTransition(async () => {
      await createBankRate({ bank_name, interest_rate, min_term_months, max_term_months, notes, is_active: true });
      setRates((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          bank_name,
          interest_rate,
          min_term_months,
          max_term_months,
          notes,
          is_active: true,
        },
      ]);
      setNewBankName("");
      setNewRate("");
      setNewMinTerm("12");
      setNewMaxTerm("60");
      setNewNotes("");
    });
  }

  function handleUpdate(rate: BankRate) {
    startTransition(async () => {
      await updateBankRate({
        ...rate,
        min_term_months: rate.min_term_months ?? 1,
        max_term_months: rate.max_term_months ?? 1,
      });
    });
  }

  function handleToggle(rate: BankRate) {
    const isActive = !rate.is_active;
    setRates((prev) => prev.map((r) => (r.id === rate.id ? { ...r, is_active: isActive } : r)));
    startTransition(async () => {
      await toggleBankRateActive(rate.id, isActive);
    });
  }

  function handleDelete(id: string) {
    setRates((prev) => prev.filter((r) => r.id !== id));
    startTransition(async () => {
      await deleteBankRate(id);
    });
  }

  function updateTextField(id: string, field: EditableField, value: string) {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function updateNumericField(id: string, field: NumericField, value: string) {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: Number(value) } : r)));
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Bank</th>
              <th className="px-4 py-3">Rate/yr %</th>
              <th className="px-4 py-3">Min term</th>
              <th className="px-4 py-3">Max term</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rates.length ? (
              rates.map((rate) => (
                <tr key={rate.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={rate.bank_name}
                      onChange={(e) => updateTextField(rate.id, "bank_name", e.target.value)}
                      onBlur={() => handleUpdate(rates.find((r) => r.id === rate.id)!)}
                      className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate.interest_rate}
                      onChange={(e) => updateNumericField(rate.id, "interest_rate", e.target.value)}
                      onBlur={() => handleUpdate(rates.find((r) => r.id === rate.id)!)}
                      className="w-24 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={rate.min_term_months ?? ""}
                      onChange={(e) => updateNumericField(rate.id, "min_term_months", e.target.value)}
                      onBlur={() => handleUpdate(rates.find((r) => r.id === rate.id)!)}
                      className="w-20 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={rate.max_term_months ?? ""}
                      onChange={(e) => updateNumericField(rate.id, "max_term_months", e.target.value)}
                      onBlur={() => handleUpdate(rates.find((r) => r.id === rate.id)!)}
                      className="w-20 rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={rate.notes ?? ""}
                      onChange={(e) => updateTextField(rate.id, "notes", e.target.value)}
                      onBlur={() => handleUpdate(rates.find((r) => r.id === rate.id)!)}
                      rows={2}
                      className="w-full min-w-[180px] rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={rate.is_active}
                      onChange={() => handleToggle(rate)}
                      className="h-4 w-4 accent-brand-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(rate.id)}
                      disabled={pending}
                      className="text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-gray-400" colSpan={7}>
                  No banks yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleCreate} className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-brand-black">Add a bank</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            type="text"
            value={newBankName}
            onChange={(e) => setNewBankName(e.target.value)}
            placeholder="Bank name"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            value={newRate}
            onChange={(e) => setNewRate(e.target.value)}
            placeholder="Rate/yr %"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
          <input
            type="number"
            min="1"
            value={newMinTerm}
            onChange={(e) => setNewMinTerm(e.target.value)}
            placeholder="Min term (months)"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
          <input
            type="number"
            min="1"
            value={newMaxTerm}
            onChange={(e) => setNewMaxTerm(e.target.value)}
            placeholder="Max term (months)"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
          <input
            type="text"
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
        >
          Add bank
        </button>
      </form>
    </div>
  );
}
