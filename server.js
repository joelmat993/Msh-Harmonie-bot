/**
 * M-SANTE HARMONIE — Serveur principal
 *
 * Ce serveur expose un webhook que Meta (WhatsApp Business API) appelle
 * à chaque message reçu. Il orchestre :
 *   1. La réception du message (route POST /webhook)
 *   2. La vérification du webhook par Meta (route GET /webhook)
 *   3. Le traitement via le moteur de conversation
 *   4. L'envoi de la réponse via l'API WhatsApp
 *
 * DÉMARRAGE :
 *   1. Copier .env.example vers .env et remplir les valeurs
 *   2. npm install
 *   3. npm start
 *
 * Le serveur doit être accessible publiquement (HTTPS) pour que Meta
 * puisse l'appeler — utiliser ngrok en développement, ou un hébergeur
 * comme Render / Railway en production.
 */

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

// ============================================================
// SANTÉ DU SERVEUR (utile pour vérifier que le déploiement fonctionne)
// ============================================================
app.get("/", (req, res) => {
  res.send("M-SANTE HARMONIE — serveur actif ✅");
});

// ============================================================
// VÉRIFICATION DU WEBHOOK (Meta appelle cette route une seule fois,
// lors de la configuration du webhook dans le tableau de bord Meta)
// ============================================================
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

// ============================================================
// RÉCEPTION DES MESSAGES (route appelée à chaque message WhatsApp entrant)
// ============================================================
app.post("/webhook", async (req, res) => {
  // Répondre immédiatement à Meta (sinon il considère l'envoi en échec
  // et réessaie, ce qui peut dupliquer les messages)
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) {
      // Peut être un accusé de lecture ou un autre type d'événement — on ignore
      return;
    }

    const from = message.from; // numéro WhatsApp de l'utilisateur
    await markAsRead(message.id).catch(() => {}); // best-effort, ne bloque pas le flux

    let messageText = "";
    let buttonId = null;

    if (message.type === "text") {
      messageText = message.text.body;
    } else if (message.type === "interactive") {
      // L'utilisateur a cliqué un bouton ou un élément de liste
      const interactive = message.interactive;
      if (interactive.type === "button_reply") {
        buttonId = interactive.button_reply.id;
      } else if (interactive.type === "list_reply") {
        buttonId = interactive.list_reply.id;
      }
    } else {
      // Type de message non géré (image, audio, etc.)
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

// ============================================================
// DÉMARRAGE
// ============================================================
app.listen(PORT, () => {
  console.log(`🌿 M-SANTÉ HARMONIE — serveur démarré sur le port ${PORT}`);
  console.log(`   Webhook à configurer dans Meta : https://VOTRE-DOMAINE/webhook`);
});
