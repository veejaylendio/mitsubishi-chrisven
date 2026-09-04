import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const REPLY_BUTTON_PREFIX = "reply:";
const REPLY_MODAL_PREFIX = "reply_modal:";

function ephemeral(content: string) {
  return Response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, flags: 64 },
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-signature-ed25519");
  const timestamp = request.headers.get("x-signature-timestamp");
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const rawBody = await request.text();

  if (!signature || !timestamp || !publicKey) {
    return new Response("Bad request", { status: 401 });
  }

  const isValid = await verifyKey(rawBody, signature, timestamp, publicKey);
  if (!isValid) {
    return new Response("Invalid request signature", { status: 401 });
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === InteractionType.PING) {
    return Response.json({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const customId: string = interaction.data?.custom_id ?? "";
    if (customId.startsWith(REPLY_BUTTON_PREFIX)) {
      const sessionId = customId.slice(REPLY_BUTTON_PREFIX.length);
      return Response.json({
        type: InteractionResponseType.MODAL,
        data: {
          custom_id: `${REPLY_MODAL_PREFIX}${sessionId}`,
          title: "Reply to customer",
          components: [
            {
              type: 1,
              components: [
                {
                  type: 4,
                  custom_id: "reply_text",
                  style: 2,
                  label: "Your reply",
                  required: true,
                  max_length: 1000,
                },
              ],
            },
          ],
        },
      });
    }
  }

  if (interaction.type === InteractionType.MODAL_SUBMIT) {
    const customId: string = interaction.data?.custom_id ?? "";
    if (customId.startsWith(REPLY_MODAL_PREFIX)) {
      const sessionId = customId.slice(REPLY_MODAL_PREFIX.length);
      const replyText: string | undefined =
        interaction.data?.components?.[0]?.components?.[0]?.value;

      if (!replyText || !replyText.trim()) {
        return ephemeral("Reply can't be empty.");
      }

      const supabase = await createClient();
      const { error } = await supabase
        .from("chat_messages")
        .insert({ session_id: sessionId, sender: "admin", body: replyText.trim() });

      return ephemeral(error ? "Something went wrong sending your reply." : "Reply sent to the customer.");
    }
  }

  return ephemeral("Unsupported interaction.");
}
