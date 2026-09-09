"use client";

import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitApplication } from "@/lib/applications/actions";
import type { VehicleOption } from "@/lib/types";

type Borrower = {
  lastName: string; firstName: string; middleName: string; birthday: string; birthplace: string;
  civilStatus: string; presentAddress: string; permanentAddress: string; residenceOwnership: string;
  yearsInAddress: string; email: string; phone: string;
};
type IncomeDetails = {
  employerBusiness: string; employerBusinessPhone: string; employerBusinessEmail: string;
  employerBusinessAddress: string; position: string; yearsInEmployment: string; grossMonthlyIncome: string;
};
type PrincipalBorrower = Borrower & IncomeDetails & { dependents: string; tin: string; mothersMaidenName: string };
type CoMaker = Borrower & IncomeDetails & { relationship: string; hasIncome: boolean; dependents: string; tin: string; mothersMaidenName: string };

const emptyBorrower: Borrower = { lastName: "", firstName: "", middleName: "", birthday: "", birthplace: "", civilStatus: "", presentAddress: "", permanentAddress: "", residenceOwnership: "", yearsInAddress: "", email: "", phone: "" };
const emptyIncome: IncomeDetails = { employerBusiness: "", employerBusinessPhone: "", employerBusinessEmail: "", employerBusinessAddress: "", position: "", yearsInEmployment: "", grossMonthlyIncome: "" };
const emptyPrincipal: PrincipalBorrower = { ...emptyBorrower, ...emptyIncome, dependents: "", tin: "", mothersMaidenName: "" };
const emptyCoMaker = (): CoMaker => ({ ...emptyBorrower, ...emptyIncome, relationship: "", hasIncome: true, dependents: "", tin: "", mothersMaidenName: "" });

function vehicleLabel(vehicle: VehicleOption) { return [vehicle.year, vehicle.name, vehicle.trim].filter(Boolean).join(" "); }

export default function ApplicationForm({ vehicles }: { vehicles: VehicleOption[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [principalBorrower, setPrincipalBorrower] = useState(emptyPrincipal);
  const [coMakers, setCoMakers] = useState<CoMaker[]>([]);
  const [vehicleId, setVehicleId] = useState("");
  const [message, setMessage] = useState("");
  const isMarried = principalBorrower.civilStatus === "Married";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null);
    startTransition(async () => {
      const result = await submitApplication({ principalBorrower, coMakers, vehicleId: vehicleId || undefined, message });
      if ("error" in result) { setError(result.error); return; }
      setSubmitted(true);
    });
  }

  if (submitted) return <div className="rounded-xl bg-white p-8 text-center shadow-sm"><h2 className="text-xl font-bold text-brand-black">Application received!</h2><p className="mt-2 text-sm text-gray-600">Thank you. We&apos;ll contact you at {principalBorrower.phone} shortly to follow up.</p></div>;

  const updatePrincipal = (field: keyof PrincipalBorrower, value: string) => setPrincipalBorrower((current) => ({ ...current, [field]: value }));
  const updateCoMaker = (index: number, field: keyof CoMaker, value: string | boolean) => setCoMakers((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));

  return <form onSubmit={handleSubmit} className="space-y-8 rounded-xl bg-white p-6 shadow-sm sm:p-8">
    <section><SectionHeading>Principal Borrower</SectionHeading><BorrowerFields value={principalBorrower} onChange={updatePrincipal} />
      <div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Dependents" required><input required value={principalBorrower.dependents} onChange={(e) => updatePrincipal("dependents", e.target.value)} className={inputClass} /></Field><Field label="TIN" required><input required value={principalBorrower.tin} onChange={(e) => updatePrincipal("tin", e.target.value)} className={inputClass} /></Field><Field label="Mother&apos;s maiden name" required><input required value={principalBorrower.mothersMaidenName} onChange={(e) => updatePrincipal("mothersMaidenName", e.target.value)} className={inputClass} /></Field></div><IncomeFields value={principalBorrower} onChange={updatePrincipal} />
    </section>
    <Field label="Vehicle you&apos;re interested in"><select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className={inputClass}><option value="">Not sure yet</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicleLabel(vehicle)}</option>)}</select></Field>
    <section className="border-t border-gray-100 pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><SectionHeading>Co-Maker</SectionHeading>{isMarried && <p className="mt-1 text-xs text-brand-red">Required because the principal borrower is married.</p>}</div><button type="button" onClick={() => setCoMakers((current) => [...current, emptyCoMaker()])} className="rounded-md border border-brand-red px-3 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red/5">+ Add Co-Maker</button></div>
      {coMakers.map((coMaker, index) => <details key={index} open className="group mt-5 rounded-md border border-gray-200 bg-gray-50/50 p-4 shadow-sm"><summary className="-m-4 flex cursor-pointer list-none items-center justify-between rounded-md p-4 font-semibold text-brand-black"><span>Co-Maker {index + 1}</span><span className="flex items-center gap-3"><button type="button" aria-label={`Remove Co-Maker ${index + 1}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setCoMakers((current) => current.filter((_, itemIndex) => itemIndex !== index)); }} className="text-xs font-semibold text-gray-500 transition-colors hover:text-brand-red">Remove</button><span aria-hidden="true" className="text-lg font-normal leading-none text-gray-400 transition-transform group-open:rotate-180">⌄</span></span></summary><div className="mt-8"><BorrowerFields value={coMaker} onChange={(field, value) => updateCoMaker(index, field, value)} /><Field label="Relationship to borrower" required><input required value={coMaker.relationship} onChange={(e) => updateCoMaker(index, "relationship", e.target.value)} className={inputClass} /></Field><label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-600"><input type="checkbox" checked={coMaker.hasIncome} onChange={(e) => updateCoMaker(index, "hasIncome", e.target.checked)} /> Co-maker has income</label>{coMaker.hasIncome && <><div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Dependents" required><input required value={coMaker.dependents} onChange={(e) => updateCoMaker(index, "dependents", e.target.value)} className={inputClass} /></Field><Field label="TIN" required><input required value={coMaker.tin} onChange={(e) => updateCoMaker(index, "tin", e.target.value)} className={inputClass} /></Field><Field label="Mother&apos;s maiden name" required><input required value={coMaker.mothersMaidenName} onChange={(e) => updateCoMaker(index, "mothersMaidenName", e.target.value)} className={inputClass} /></Field></div><IncomeFields value={coMaker} onChange={(field, value) => updateCoMaker(index, field, value)} /></>}</div></details>)}
    </section>
    <Field label="Additional notes"><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={inputClass} /></Field>{error && <p className="text-sm text-brand-red">{error}</p>}<button type="submit" disabled={pending} className="w-full rounded-md bg-brand-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60">{pending ? "Submitting..." : "Submit Application"}</button>
  </form>;
}

function BorrowerFields({ value, onChange }: { value: Borrower; onChange: (field: keyof Borrower, value: string) => void }) {
  const fields: [keyof Borrower, string, string?][] = [["lastName", "Last name"], ["firstName", "First name"], ["middleName", "Middle name"], ["birthday", "Birthday", "date"], ["birthplace", "Birthplace"], ["civilStatus", "Civil status"], ["presentAddress", "Present address"], ["permanentAddress", "Permanent address"], ["residenceOwnership", "Rented or owned"], ["yearsInAddress", "Years in address"], ["email", "Email address", "email"], ["phone", "Contact number", "tel"]];
  return <div className="grid gap-4 sm:grid-cols-2">{fields.map(([field, label, type]) => <Field key={field} label={label} required={!['middleName', 'email'].includes(field)}>{field === "civilStatus" ? <select required value={value[field]} onChange={(e) => onChange(field, e.target.value)} className={inputClass}><option value="">Select status</option><option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option></select> : field === "residenceOwnership" ? <select required value={value[field]} onChange={(e) => onChange(field, e.target.value)} className={inputClass}><option value="">Select one</option><option>Rented</option><option>Owned</option></select> : <input type={type ?? "text"} required={!['middleName', 'email'].includes(field)} value={value[field]} onChange={(e) => onChange(field, e.target.value)} className={inputClass} />}</Field>)}</div>;
}

function IncomeFields({ value, onChange }: { value: IncomeDetails; onChange: (field: keyof IncomeDetails, value: string) => void }) {
  const fields: [keyof IncomeDetails, string, string?][] = [["employerBusiness", "Employer/Business"], ["employerBusinessPhone", "Employer/Business telephone number", "tel"], ["employerBusinessEmail", "Company/Business email", "email"], ["employerBusinessAddress", "Employer/Business address"], ["position", "Position"], ["yearsInEmployment", "Years in employment/business"]];
  return <div className="mt-5 grid gap-4 rounded-md bg-gray-50 p-4 sm:grid-cols-2"><h3 className="text-sm font-bold text-brand-black sm:col-span-2">Employment or Business</h3>{fields.map(([field, label, type]) => <Field key={field} label={label} required><input type={type ?? "text"} required value={value[field]} onChange={(e) => onChange(field, e.target.value)} className={inputClass} /></Field>)}<Field label="Gross monthly salary/income" required><input type="number" min="0" step="0.01" required value={value.grossMonthlyIncome} onChange={(e) => onChange("grossMonthlyIncome", e.target.value)} className={inputClass} /></Field></div>;
}

function SectionHeading({ children }: { children: ReactNode }) { return <h2 className="text-lg font-bold text-brand-black">{children}</h2>; }
const inputClass = "mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black";
function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) { return <label className="block text-xs font-semibold text-gray-500">{label}{required && <span className="text-brand-red"> *</span>}{children}</label>; }
