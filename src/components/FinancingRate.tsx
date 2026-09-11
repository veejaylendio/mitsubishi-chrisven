"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { computeLoanQuote } from "@/lib/financing/calculate";
import type { BankRate, VehiclePriceOption } from "@/lib/types";

const DP_OPTIONS = [20, 25, 30];
const ALL_IN_TERM_MONTHS = 60;
const CALCULATOR_TERM_OPTIONS = [36, 48, 60];

type Tab = "cash" | "financing" | "calculator";

function vehicleLabel(vehicle: VehiclePriceOption) {
  return [vehicle.year, vehicle.name, vehicle.trim].filter(Boolean).join(" ");
}

function peso(amount: number) {
  return `₱${amount.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

function netPriceOf(vehicle: VehiclePriceOption) {
  return Math.max(0, (vehicle.price ?? 0) - (vehicle.discount ?? 0));
}

function VehiclePreview({ vehicle }: { vehicle: VehiclePriceOption }) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2">
      {vehicle.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vehicle.image_url}
          alt={vehicleLabel(vehicle)}
          className="h-16 w-24 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-gray-200 text-[10px] text-gray-400">
          No photo
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-brand-black">{vehicleLabel(vehicle)}</p>
        <p className="text-xs text-gray-400">{peso(vehicle.price ?? 0)}</p>
      </div>
    </div>
  );
}

export default function FinancingRate({
  banks,
  vehicles,
}: {
  banks: BankRate[];
  vehicles: VehiclePriceOption[];
}) {
  const [tab, setTab] = useState<Tab>("cash");

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="grid grid-cols-3 divide-x divide-gray-100 overflow-hidden rounded-t-xl border border-gray-100">
        <TabButton label="Cash or PO" active={tab === "cash"} onClick={() => setTab("cash")} />
        <TabButton
          label="All-in Financing"
          active={tab === "financing"}
          onClick={() => setTab("financing")}
        />
        <TabButton label="Calculator" active={tab === "calculator"} onClick={() => setTab("calculator")} />
      </div>

      <div className="rounded-b-xl border border-t-0 border-gray-100 p-6 sm:p-8">
        {tab === "cash" && <CashOrPo vehicles={vehicles} />}
        {tab === "financing" && <AllInFinancing vehicles={vehicles} banks={banks} />}
        {tab === "calculator" && <Calculator vehicles={vehicles} banks={banks} />}
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-3 text-center text-sm font-semibold transition ${
        active ? "bg-brand-red text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function CashOrPo({ vehicles }: { vehicles: VehiclePriceOption[] }) {
  if (!vehicles.length) {
    return <p className="text-sm text-gray-500">No vehicles available right now.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Unit Price</th>
            <th className="px-4 py-3">Discount</th>
            <th className="px-4 py-3">Net Price</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-semibold text-brand-black">{vehicleLabel(vehicle)}</td>
              <td className="px-4 py-3 text-gray-600">{peso(vehicle.price ?? 0)}</td>
              <td className="px-4 py-3 text-gray-600">{peso(vehicle.discount ?? 0)}</td>
              <td className="px-4 py-3 font-semibold text-brand-red">{peso(netPriceOf(vehicle))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllInFinancing({ vehicles, banks }: { vehicles: VehiclePriceOption[]; banks: BankRate[] }) {
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "");
  const [dpPercent, setDpPercent] = useState(DP_OPTIONS[0]);

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const netPrice = vehicle ? netPriceOf(vehicle) : 0;
  const downPayment = netPrice * (dpPercent / 100);
  const principal = Math.max(0, netPrice - downPayment);

  const quotes = useMemo(() => {
    return banks
      .filter(
        (bank) =>
          (bank.min_term_months == null || ALL_IN_TERM_MONTHS >= bank.min_term_months) &&
          (bank.max_term_months == null || ALL_IN_TERM_MONTHS <= bank.max_term_months),
      )
      .map((bank) => ({ bank, quote: computeLoanQuote(principal, bank.interest_rate, ALL_IN_TERM_MONTHS) }))
      .sort((a, b) => a.quote.monthlyPayment - b.quote.monthlyPayment);
  }, [banks, principal]);

  return (
    <div className="space-y-6">
      <Field label="Unit">
        <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {vehicleLabel(v)}
            </option>
          ))}
        </select>
      </Field>
      {vehicle && <VehiclePreview vehicle={vehicle} />}

      <div>
        <p className="text-xs font-semibold text-gray-500">Down payment</p>
        <div className="mt-2 flex gap-3">
          {DP_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setDpPercent(option)}
              className={`flex-1 rounded-md border px-3 py-2 text-center text-sm font-bold transition ${
                dpPercent === option
                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {option}%
            </button>
          ))}
        </div>
      </div>

      {vehicle && quotes.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Bank</th>
                <th className="px-4 py-3">Down payment due</th>
                <th className="px-4 py-3">Monthly ({ALL_IN_TERM_MONTHS} mo.)</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(({ bank, quote }, index) => (
                <tr key={bank.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-semibold text-brand-black">
                    {bank.bank_name}
                    {index === 0 && (
                      <span className="ml-2 rounded-full bg-brand-red/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-red">
                        Lowest
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{peso(downPayment)}</td>
                  <td className="px-4 py-3 font-semibold text-brand-black">{peso(quote.monthlyPayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No partner bank offers this term right now.</p>
      )}
    </div>
  );
}

function Calculator({ vehicles, banks }: { vehicles: VehiclePriceOption[]; banks: BankRate[] }) {
  const [vehicleId, setVehicleId] = useState("");
  const [price, setPrice] = useState("");
  const [term, setTerm] = useState(CALCULATOR_TERM_OPTIONS[0]);

  function handleVehicleChange(id: string) {
    setVehicleId(id);
    const vehicle = vehicles.find((v) => v.id === id);
    if (vehicle) {
      setPrice(String(netPriceOf(vehicle)));
    }
  }

  const selectedVehicle = vehicles.find((v) => v.id === vehicleId);
  const principal = Math.max(0, Number(price) || 0);

  const bestQuote = useMemo(() => {
    return banks
      .filter(
        (bank) =>
          (bank.min_term_months == null || term >= bank.min_term_months) &&
          (bank.max_term_months == null || term <= bank.max_term_months),
      )
      .map((bank) => ({ bank, quote: computeLoanQuote(principal, bank.interest_rate, term) }))
      .sort((a, b) => a.quote.monthlyPayment - b.quote.monthlyPayment)[0];
  }, [banks, principal, term]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Unit">
          <select
            value={vehicleId}
            onChange={(e) => handleVehicleChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Enter price manually</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {vehicleLabel(v)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Unit price (₱)">
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      {selectedVehicle && <VehiclePreview vehicle={selectedVehicle} />}

      <div>
        <p className="text-xs font-semibold text-gray-500">Loan term (minimum of 3 years)</p>
        <div className="mt-2 flex gap-3">
          {CALCULATOR_TERM_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTerm(option)}
              className={`flex-1 rounded-md border px-3 py-2 text-center text-sm font-bold transition ${
                term === option
                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {option / 12} yrs
            </button>
          ))}
        </div>
      </div>

      {principal > 0 && bestQuote ? (
        <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-5 py-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Monthly</span>
          <span className="text-2xl font-extrabold text-brand-red">{peso(bestQuote.quote.monthlyPayment)}</span>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Enter a unit price to see the estimated monthly payment.</p>
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
