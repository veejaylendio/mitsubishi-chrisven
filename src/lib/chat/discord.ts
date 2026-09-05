type NotifyDiscordInquiryInput = {
  sessionId: string;
  question: string;
  name: string | null;
  phone: string | null;
  email: string | null;
};

function buildEmbed(input: NotifyDiscordInquiryInput) {
  const contactLines = [
    input.name ? `**Name:** ${input.name}` : null,
    input.phone ? `**Phone:** ${input.phone}` : null,
    input.email ? `**Email:** ${input.email}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: "New chatbot inquiry",
    description: input.question,
    color: 0xc8102e,
    fields: [
      { name: "Contact", value: contactLines || "Not provided" },
      { name: "Session", value: input.sessionId },
    ],
  };
}

async function notifyViaBot(input: NotifyDiscordInquiryInput, botToken: string, channelId: string) {
  try {
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [buildEmbed(input)],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 1,
                label: "Reply",
                custom_id: `reply:${input.sessionId}`,
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[discord] notifyViaBot failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[discord] notifyViaBot threw", err);
  }
}

async function notifyViaWebhook(input: NotifyDiscordInquiryInput, webhookUrl: string) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [buildEmbed(input)] }),
    });
    if (!res.ok) {
      console.error("[discord] notifyViaWebhook failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("[discord] notifyViaWebhook threw", err);
  }
}

export async function notifyDiscordInquiry(input: NotifyDiscordInquiryInput) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID;
  if (botToken && channelId) {
    await notifyViaBot(input, botToken, channelId);
    return;
  }

  // Bot credentials (needed for the "Reply" button) aren't set up yet — fall back to the
  // plain incoming webhook so notifications keep working in the meantime.
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    await notifyViaWebhook(input, webhookUrl);
    return;
  }

  console.error("[discord] notifyDiscordInquiry skipped: no DISCORD_BOT_TOKEN/DISCORD_CHANNEL_ID or DISCORD_WEBHOOK_URL set");
}
