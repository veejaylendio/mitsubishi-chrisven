"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import {
  askOtherQuestion,
  getActiveFaqs,
  getChatMessages,
  postBotAnswer,
  setChatSessionName,
  startChatSession,
} from "@/lib/chat/actions";
import type { ChatMessage, Faq } from "@/lib/types";

const SESSION_KEY = "chatbot_session_id";
const NAME_SET_KEY = "chatbot_name_set";

type Stage = "closed" | "contact" | "thanks" | "name" | "chat";

function localMessage(sessionId: string, sender: ChatMessage["sender"], body: string): ChatMessage {
  return {
    id: `local-${Date.now()}-${Math.random()}`,
    session_id: sessionId,
    sender,
    body,
    created_at: new Date().toISOString(),
  };
}

export default function Chatbot() {
  const [stage, setStage] = useState<Stage>("closed");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [pending, startTransition] = useTransition();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const questionInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage !== "chat") return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, stage]);

  useEffect(() => {
    if (stage !== "chat" || !sessionId) return;
    const interval = setInterval(async () => {
      const latest = await getChatMessages(sessionId);
      setMessages((prev) => {
        const knownIds = new Set(prev.map((m) => m.id));
        const newOnes = latest.filter((m) => !knownIds.has(m.id));
        return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [stage, sessionId]);

  function openPanel() {
    if (stage !== "closed") {
      setStage("closed");
      return;
    }

    const storedSessionId = window.localStorage.getItem(SESSION_KEY);
    const nameSet = window.localStorage.getItem(NAME_SET_KEY) === "true";

    if (storedSessionId && nameSet) {
      setSessionId(storedSessionId);
      setStage("chat");
      startTransition(async () => {
        const [history, activeFaqs] = await Promise.all([
          getChatMessages(storedSessionId),
          getActiveFaqs(),
        ]);
        setMessages(history);
        setFaqs(activeFaqs);
      });
      return;
    }

    if (storedSessionId) {
      setSessionId(storedSessionId);
      setStage("name");
      return;
    }

    setStage("contact");
  }

  function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactError(null);
    startTransition(async () => {
      const result = await startChatSession({ phone, email });
      if ("error" in result) {
        setContactError(result.error);
        return;
      }
      window.localStorage.setItem(SESSION_KEY, result.id);
      setSessionId(result.id);
      setStage("thanks");
    });
  }

  function handleNameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sessionId) return;
    setNameError(null);
    startTransition(async () => {
      const result = await setChatSessionName(sessionId, name);
      if ("error" in result) {
        setNameError(result.error);
        return;
      }
      window.localStorage.setItem(NAME_SET_KEY, "true");
      const activeFaqs = await getActiveFaqs();
      setMessages([result.message]);
      setFaqs(activeFaqs);
      setStage("chat");
    });
  }

  function handleFaqClick(faq: Faq) {
    if (!sessionId) return;
    setMessages((prev) => [...prev, localMessage(sessionId, "visitor", faq.question)]);
    startTransition(async () => {
      const result = await postBotAnswer(sessionId, faq.id);
      if ("message" in result) {
        setMessages((prev) => [...prev, result.message]);
      }
    });
  }

  function handleOtherClick() {
    if (!sessionId) return;
    setMessages((prev) => [...prev, localMessage(sessionId, "bot", "Sure — what would you like to ask us?")]);
    questionInputRef.current?.focus();
  }

  function handleQuestionSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sessionId || !question.trim()) return;
    const body = question.trim();
    setQuestion("");
    const optimistic = localMessage(sessionId, "visitor", body);
    setMessages((prev) => [...prev, optimistic]);
    startTransition(async () => {
      const result = await askOtherQuestion(sessionId, body);
      if ("messages" in result) {
        setMessages((prev) => [...prev.filter((m) => m.id !== optimistic.id), ...result.messages]);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        aria-label={stage === "closed" ? "Open chat" : "Close chat"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition hover:bg-brand-red-dark"
      >
        {stage === "closed" ? <ChatIcon /> : <CloseIcon />}
      </button>

      {stage !== "closed" && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
          <div className="bg-brand-black px-4 py-3">
            <p className="text-sm font-bold text-white">Chrisven Romagos</p>
            <p className="text-xs text-white/60">Mitsubishi Motors Sales</p>
          </div>

          {stage === "contact" && (
            <form onSubmit={handleContactSubmit} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              <p className="text-sm text-gray-600">
                Before we chat, please share a phone number or email so we can follow up.
              </p>
              <label className="text-xs font-semibold text-gray-500">
                Phone number
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
                  placeholder="09xx xxx xxxx"
                />
              </label>
              <label className="text-xs font-semibold text-gray-500">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
                  placeholder="you@example.com"
                />
              </label>
              {contactError && <p className="text-xs text-brand-red">{contactError}</p>}
              <button
                type="submit"
                disabled={pending}
                className="mt-auto rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
              >
                Continue
              </button>
            </form>
          )}

          {stage === "thanks" && (
            <div className="flex flex-1 flex-col justify-between p-4">
              <BotBubble text="Thanks for reaching out! We've got your contact info." />
              <button
                type="button"
                onClick={() => setStage("name")}
                className="mt-4 rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark"
              >
                Continue
              </button>
            </div>
          )}

          {stage === "name" && (
            <form onSubmit={handleNameSubmit} className="flex flex-1 flex-col gap-3 p-4">
              <BotBubble text="And what's your name? So I know what to call you." />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
                placeholder="Your name"
              />
              {nameError && <p className="text-xs text-brand-red">{nameError}</p>}
              <button
                type="submit"
                disabled={pending}
                className="mt-auto rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-60"
              >
                Continue
              </button>
            </form>
          )}

          {stage === "chat" && (
            <>
              <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              <div className="border-t border-gray-100 p-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {faqs.map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => handleFaqClick(faq)}
                      className="rounded-full border border-brand-red/30 px-3 py-1 text-xs font-medium text-brand-red transition hover:bg-brand-red/10"
                    >
                      {faq.question}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleOtherClick}
                    className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
                  >
                    Ask something else
                  </button>
                </div>

                <form onSubmit={handleQuestionSubmit} className="flex gap-2">
                  <input
                    ref={questionInputRef}
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask us anything..."
                    className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-brand-black"
                  />
                  <button
                    type="submit"
                    disabled={pending || !question.trim()}
                    className="rounded-md bg-brand-red px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-red-dark disabled:opacity-40"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isVisitor = message.sender === "visitor";
  return (
    <div className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          isVisitor ? "bg-brand-red text-white" : "bg-gray-100 text-brand-black"
        }`}
      >
        {message.body}
      </p>
    </div>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start">
      <p className="max-w-[80%] rounded-2xl bg-gray-100 px-3 py-2 text-sm text-brand-black">{text}</p>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
