"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitApplication } from "@/lib/applications/actions";
import type { FinancingType, VehicleOption } from "@/lib/types";

function vehicleLabel(vehicle: VehicleOption) {
  return [vehicle.year, vehicle.name, vehicle.trim].filter(Boolean).join(" ");
}

export default function ApplicationForm({ vehicles }: { vehicles: VehicleOption[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [financingType, setFinancingType] = useState<FinancingType>("cash");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [employer, setEmployer] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitApplication({
        fullName,
        phone,
        email,
        address,
        vehicleId: vehicleId || undefined,
        financingType,
        employer,
        monthlyIncome: monthlyIncome || undefined,
        downPayment: downPayment || undefined,
        message,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-brand-black">Application received!</h2>
        <p className="mt-2 text-sm text-gray-600">
          Thanks, {fullName.split(" ")[0]}. We&apos;ll reach out to you at {phone} shortly to
          follow up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
      <div>
        <p className="mb-2 text-sm font-semibold text-brand-black">How would you like to pay?</p>
        <div className="grid grid-cols-2 gap-3">
          {(["cash", "loan"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFinancingType(option)}
              className={`rounded-md border px-4 py-3 text-sm font-semibold transition ${
                financingType === option
                  ? "border-brand-red bg-brand-red/10 text-brand-red"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {option === "cash" ? "Cash Purchase" : "Auto Loan / Financing"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Phone number" required>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xx xxx xxxx"
            className={inputClass}
          />
        </Field>
        <Field label="Email address">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Address">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Vehicle you're interested in">
        <select
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className={inputClass}
        >
          <option value="">Not sure yet</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicleLabel(vehicle)}
            </option>
          ))}
        </select>
      </Field>

      {financingType === "loan" && (
        <div className="grid gap-4 rounded-md bg-gray-50 p-4 sm:grid-cols-2">
          <Field label="Employer" required>
            <input
              type="text"
              required
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Monthly gross income" required>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Desired down payment">
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
      )}

      <Field label="Anything else we should know?">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-500">
      {label}
      {required && <span className="text-brand-red"> *</span>}
      {children}
    </label>
  );
}
