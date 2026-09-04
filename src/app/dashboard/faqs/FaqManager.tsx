"use client";

import { useState, useTransition, type FormEvent } from "react";
import type { Faq } from "@/lib/types";
import { createFaq, deleteFaq, toggleFaqActive, updateFaq } from "./actions";

export default function FaqManager({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [pending, startTransition] = useTransition();

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const question = newQuestion.trim();
    const answer = newAnswer.trim();
    startTransition(async () => {
      await createFaq({ question, answer, is_active: true });
      setFaqs((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, question, answer, sort_order: prev.length, is_active: true },
      ]);
      setNewQuestion("");
      setNewAnswer("");
    });
  }

  function handleUpdate(faq: Faq) {
    startTransition(async () => {
      await updateFaq({ id: faq.id, question: faq.question, answer: faq.answer, is_active: faq.is_active });
    });
  }

  function handleToggle(faq: Faq) {
    const isActive = !faq.is_active;
    setFaqs((prev) => prev.map((f) => (f.id === faq.id ? { ...f, is_active: isActive } : f)));
    startTransition(async () => {
      await toggleFaqActive(faq.id, isActive);
    });
  }

  function handleDelete(id: string) {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    startTransition(async () => {
      await deleteFaq(id);
    });
  }

  function updateField(id: string, field: "question" | "answer", value: string) {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Answer</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {faqs.length ? (
              faqs.map((faq) => (
                <tr key={faq.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3">
                    <textarea
                      value={faq.question}
                      onChange={(e) => updateField(faq.id, "question", e.target.value)}
                      onBlur={() => handleUpdate(faqs.find((f) => f.id === faq.id)!)}
                      rows={2}
                      className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateField(faq.id, "answer", e.target.value)}
                      onBlur={() => handleUpdate(faqs.find((f) => f.id === faq.id)!)}
                      rows={2}
                      className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-brand-black"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={faq.is_active}
                      onChange={() => handleToggle(faq)}
                      className="h-4 w-4 accent-brand-red"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(faq.id)}
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
                <td className="px-4 py-3 text-gray-400" colSpan={4}>
                  No FAQs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleCreate} className="rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold text-brand-black">Add a FAQ</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Question"
            rows={2}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Answer"
            rows={2}
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-3 rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
        >
          Add FAQ
        </button>
      </form>
    </div>
  );
}
