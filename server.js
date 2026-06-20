require("dotenv").config();
const express = require("express");
const {
  sendTextMessage,
  sendButtonsMessage,
  markAsRead,
} = require("./whatsappClient");
const { processMessage, buildOutgoingMessage } = require("./conversationEngine");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || "msh_harmonie_verify";

app.get("/", (req, res) => {
  res.send("M-SANTE HARMONIE — serveur actif ✅");
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook vérifié avec succès par Meta");
    return res.status(200).send(challenge);
  }

  console.warn("❌ Échec de vérification du webhook — token incorrect");
  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return;
    }

    const from = message.from;
    await markAsRead(message.id).catch(() => {});

    let messageText = "";
    let buttonId = null;

    if (message.type === "text") {
      messageText = message.text.body;
    } else if (message.type === "interactive") {
      const interactive = message.interactive;
      if (interactive.type === "button_reply") {
        buttonId = interactive.button_reply.id;
      } else if (interactive.type === "list_reply") {
        buttonId = interactive.list_reply.id;
      }
    } else {
      await sendTextMessage(
        from,
        "Je peux seulement lire du texte pour le moment. Peux-tu reformuler ta question par écrit ? 💙"
      );
      return;
    }

    const { node, profile } = processMessage(from, messageText, buttonId);
    const outgoing = buildOutgoingMessage(node, profile);

    if (outgoing.buttons && outgoing.buttons.length > 0) {
      await sendButtonsMessage(from, outgoing.text, outgoing.buttons);
    } else {
      await sendTextMessage(from, outgoing.text);
    }
  } catch (error) {
    console.error("Erreur lors du traitement du message :", error?.response?.data || error.message);
  }
});

app.listen(PORT, () => {
  console.log(`🌿 M-SANTÉ HARMONIE — serveur démarré sur le port ${PORT}`);
  console.log(`   Webhook à configurer dans Meta : https://VOTRE-DOMAINE/webhook`);
});
