type NotifyDiscordApplicationInput = {
  fullName: string;
  phone: string;
  email: string | null;
  financingType: "cash" | "loan";
  vehicleLabel: string | null;
};

export async function notifyDiscordApplication(input: NotifyDiscordApplicationInput) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "New application submitted",
          description: input.vehicleLabel ?? "No vehicle specified",
          color: 0xc8102e,
          fields: [
            { name: "Name", value: input.fullName },
            { name: "Phone", value: input.phone },
            { name: "Email", value: input.email ?? "Not provided" },
            { name: "Financing", value: input.financingType === "loan" ? "Auto Loan" : "Cash" },
          ],
        },
      ],
    }),
  }).catch(() => {});
}
