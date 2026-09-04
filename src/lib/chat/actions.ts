"use server";

import { createClient } from "@/lib/supabase/server";
import { contactSchema, nameSchema, chatMessageSchema } from "./schemas";
import { notifyDiscordInquiry } from "./discord";
import type { ChatMessage, Faq } from "@/lib/types";

const MESSAGE_COLUMNS = "id, session_id, sender, body, created_at";

export async function startChatSession(
  input: { phone?: string; email?: string },
): Promise<{ error: string } | { id: string }> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid contact info." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      visitor_phone: parsed.data.phone,
      visitor_email: parsed.data.email,
      status: "open",
    })
    .select("id")
    .single();
  if (error || !data) return { error: "Something went wrong. Please try again." };

  return { id: data.id as string };
}

export async function setChatSessionName(
  sessionId: string,
  name: string,
): Promise<{ error: string } | { message: ChatMessage }> {
  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter your name." };
  }

  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("chat_sessions")
    .update({ visitor_name: parsed.data })
    .eq("id", sessionId);
  if (updateError) return { error: "Something went wrong. Please try again." };

  const { data: message, error: messageError } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      sender: "bot",
      body: `Hi ${parsed.data}, welcome to Chrisven Romagos Mitsubishi Motors! How can I help you today?`,
    })
    .select(MESSAGE_COLUMNS)
    .single();
  if (messageError || !message) return { error: "Something went wrong. Please try again." };

  return { message: message as ChatMessage };
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chat_messages")
    .select(MESSAGE_COLUMNS)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  return (data ?? []) as ChatMessage[];
}

export async function getActiveFaqs() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Faq[];
}

export async function postBotAnswer(
  sessionId: string,
  faqId: string,
): Promise<{ error: string } | { message: ChatMessage }> {
  const supabase = await createClient();
  const { data: faq } = await supabase
    .from("faqs")
    .select("answer")
    .eq("id", faqId)
    .eq("is_active", true)
    .maybeSingle();
  if (!faq) return { error: "That question is no longer available." };

  const { data: message, error } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, sender: "bot", body: faq.answer })
    .select(MESSAGE_COLUMNS)
    .single();
  if (error || !message) return { error: "Something went wrong. Please try again." };

  return { message: message as ChatMessage };
}

export async function askOtherQuestion(
  sessionId: string,
  body: string,
): Promise<{ error: string } | { messages: ChatMessage[] }> {
  const parsed = chatMessageSchema.safeParse({ sessionId, body });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please enter a question." };
  }

  const supabase = await createClient();
  const { data: session } = await supabase
    .from("chat_sessions")
    .select("visitor_name, visitor_phone, visitor_email")
    .eq("id", sessionId)
    .maybeSingle();

  const { data: visitorMessage, error: visitorError } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, sender: "visitor", body: parsed.data.body })
    .select(MESSAGE_COLUMNS)
    .single();
  if (visitorError || !visitorMessage) return { error: "Something went wrong. Please try again." };

  const contact =
    [session?.visitor_email, session?.visitor_phone].filter(Boolean).join(" or ") ||
    "the contact info you gave us";
  const { data: botMessage, error: botError } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      sender: "bot",
      body: `Thanks! We've forwarded your question to our team — we'll get back to you at ${contact} soon.`,
    })
    .select(MESSAGE_COLUMNS)
    .single();
  if (botError || !botMessage) return { error: "Something went wrong. Please try again." };

  await notifyDiscordInquiry({
    sessionId,
    question: parsed.data.body,
    name: session?.visitor_name ?? null,
    phone: session?.visitor_phone ?? null,
    email: session?.visitor_email ?? null,
  });

  return { messages: [visitorMessage, botMessage] as ChatMessage[] };
}
